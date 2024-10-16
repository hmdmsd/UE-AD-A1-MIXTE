import grpc
import booking_pb2
import booking_pb2_grpc
import showtime_pb2_grpc
import showtime_pb2
from concurrent import futures
import json
from db import MongoDBClient
import os
from dotenv import load_dotenv

class BookingServicer(booking_pb2_grpc.BookingServicer):
    def __init__(self):
        # Load environment variables
        load_dotenv()

        # Connect to MongoDB
        self.db = MongoDBClient()
        self.bookings_collection = self.db.get_collection('bookings_collection')

        # Load bookings data from the JSON file if the collection is empty
        with open('./data/bookings.json', "r") as jsf:
            _bookings = json.load(jsf)["bookings"]

        if _bookings:
            if self.bookings_collection.count_documents({}) == 0:
                self.bookings_collection.insert_many(_bookings)
                print(f"{len(_bookings)} bookings inserted successfully!")
            else:
                print("Bookings collection already populated.")
        else:
            print("No bookings found in the provided data.")

        # Connect to the Showtime service as a client
        showtime_host = os.getenv('SHOWTIME_HOST', 'showtime')
        showtime_port = os.getenv('SHOWTIME_PORT', '3202')
        self.showtime_channel = grpc.insecure_channel(f'{showtime_host}:{showtime_port}')
        self.showtime_stub = showtime_pb2_grpc.ShowtimeStub(self.showtime_channel)

    def GetBookings(self, request, context):
        booking_list = booking_pb2.BookingList()
        cursor = self.bookings_collection.find({})
        for booking in cursor:
            user_booking = booking_list.bookings.add()
            user_booking.userid = booking['userid']
            for date in booking['dates']:
                movie_booking = user_booking.dates.add()
                movie_booking.date = date['date']
                movie_booking.movie_ids.extend(date['movies'])
        return booking_list

    def get_movies_by_date(self, date):
        request = showtime_pb2.Date(date=date)
        movie_schedules = self.showtime_stub.GetMoviesByDate(request)

        movies_schedules_dict = {
            "date": movie_schedules.date,
            "movies": list(movie_schedules.movie_ids)
        }

        return movies_schedules_dict

    def GetShowtimeMovies(self, request, context):
        showtime_request = showtime_pb2.Date(date=request.date)
        
        try:
            movie_schedule = self.showtime_stub.GetMoviesByDate(showtime_request)
            response = booking_pb2.MovieSchedule(date=movie_schedule.date)
            response.movie_ids.extend(movie_schedule.movie_ids)
            return response
        except grpc.RpcError as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error contacting Showtime service: {e.details()}")
            return booking_pb2.MovieSchedule()

    def GetUserBookings(self, request, context):
        booking = self.bookings_collection.find_one({"userid": request.userid})
        if booking:
            user_booking = booking_pb2.UserBooking(userid=booking['userid'])
            for date in booking['dates']:
                movie_booking = user_booking.dates.add()
                movie_booking.date = date['date']
                movie_booking.movie_ids.extend(date['movies'])
            return user_booking
        context.set_code(grpc.StatusCode.NOT_FOUND)
        context.set_details('No bookings found for the given user')
        return booking_pb2.UserBooking()

    def AddBooking(self, request, context):
        showtime_movies = self.get_movies_by_date(request.date)

        if request.movieid not in showtime_movies['movies']:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details('Movie ID does not exist for the given date')
            return booking_pb2.UserBooking()

        booking = self.bookings_collection.find_one({"userid": request.userid})
        if booking:
            for date in booking['dates']:
                if date['date'] == request.date:
                    if request.movieid not in date['movies']:
                        date['movies'].append(request.movieid)
                        self.bookings_collection.update_one(
                            {"userid": request.userid, "dates.date": request.date},
                            {"$set": {"dates.$.movies": date['movies']}}
                        )
                    else:
                        context.set_code(grpc.StatusCode.ALREADY_EXISTS)
                        context.set_details('Booking already exists')
                        return booking_pb2.UserBooking()
                    break
            else:
                booking['dates'].append({'date': request.date, 'movies': [request.movieid]})
                self.bookings_collection.update_one(
                    {"userid": request.userid},
                    {"$set": {"dates": booking['dates']}}
                )
        else:
            new_booking = {
                'userid': request.userid,
                'dates': [{'date': request.date, 'movies': [request.movieid]}]
            }
            self.bookings_collection.insert_one(new_booking)

        return self.GetUserBookings(booking_pb2.UserID(userid=request.userid), context)
    
    def RemoveBooking(self, request, context):
        booking = self.bookings_collection.find_one({"userid": request.userid})
        if booking:
            for date in booking['dates']:
                if date['date'] == request.date:
                    if request.movieid in date['movies']:
                        date['movies'].remove(request.movieid)

                        if not date['movies']:
                            booking['dates'].remove(date)

                        if not booking['dates']:
                            self.bookings_collection.delete_one({"userid": request.userid})
                        else:
                            self.bookings_collection.update_one(
                                {"userid": request.userid},
                                {"$set": {"dates": booking['dates']}}
                            )

                        return self.GetUserBookings(booking_pb2.UserID(userid=request.userid), context)
                    else:
                        context.set_code(grpc.StatusCode.NOT_FOUND)
                        context.set_details('Movie not found in booking')
                        return booking_pb2.UserBooking()
                else:
                    context.set_code(grpc.StatusCode.NOT_FOUND)
                    context.set_details('Date not found in booking')
                    return booking_pb2.UserBooking()
        context.set_code(grpc.StatusCode.NOT_FOUND)
        context.set_details('User not found')
        return booking_pb2.UserBooking()
    
    def GetUserBookingsWithShowtimes(self, request, context):
        user_booking = self.GetUserBookings(request, context)
        if not user_booking.userid:
            return booking_pb2.UserBookingWithShowtimes()

        user_booking_with_showtimes = booking_pb2.UserBookingWithShowtimes(
            userid=user_booking.userid
        )

        for date in user_booking.dates:
            showtime_request = showtime_pb2.Date(date=date.date)
            try:
                movie_schedule = self.showtime_stub.GetMoviesByDate(showtime_request)
                booking_with_showtime = user_booking_with_showtimes.dates.add()
                booking_with_showtime.date = date.date
                booking_with_showtime.movie_ids.extend(date.movie_ids)
                booking_with_showtime.all_movie_ids.extend(movie_schedule.movie_ids)
            except grpc.RpcError as e:
                print(f"Error fetching showtimes for date {date.date}: {e.details()}")
                context.set_code(e.code())
                context.set_details(f"Error fetching showtimes: {e.details()}")
                return booking_pb2.UserBookingWithShowtimes()

        return user_booking_with_showtimes

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    booking_pb2_grpc.add_BookingServicer_to_server(BookingServicer(), server)
    port = os.getenv('BOOKING_PORT', '3201')
    server.add_insecure_port(f'[::]:{port}')
    print(f"[INFO] Booking Server running on port {port}")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    print("Starting booking service...")
    serve()