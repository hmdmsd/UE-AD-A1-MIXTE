import grpc
from concurrent import futures
import json
import booking_pb2, booking_pb2_grpc
import showtime_pb2, showtime_pb2_grpc

class BookingServicer(booking_pb2_grpc.BookingServicer):
    def __init__(self):
        # Load bookings data from the JSON file
        with open('{}/data/bookings.json'.format("."), "r") as jsf:
            self.db = json.load(jsf)["bookings"]

        # Connect to the Showtime service as a client
        self.showtime_channel = grpc.insecure_channel('showtime:3202')
        self.showtime_stub = showtime_pb2_grpc.ShowtimeStub(self.showtime_channel)

    def GetBookings(self, request, context):
        booking_list = booking_pb2.BookingList()
        for booking in self.db:
            user_booking = booking_list.bookings.add()
            user_booking.userid = booking['userid']
            for date in booking['dates']:
                movie_booking = user_booking.dates.add()
                movie_booking.date = date['date']
                movie_booking.movie_ids.extend(date['movies'])
        return booking_list

    def get_movies_by_date(self, date):
        """Client-side method to fetch movies from the Showtime service by date."""
        request = showtime_pb2.Date(date=date)
        movie_schedules = self.showtime_stub.GetMoviesByDate(request)

        movies_schedules_dict = {
            "date": movie_schedules.date,
            "movies": list(movie_schedules.movie_ids)
        }

        return movies_schedules_dict

    def GetShowtimeMovies(self, request, context):
        """RPC method to fetch movie schedule from Showtime."""
        # Call the Showtime service to get movie schedules by date
        showtime_request = showtime_pb2.Date(date=request.date)
        
        try:
            # Fetch the movie schedule from the Showtime service
            movie_schedule = self.showtime_stub.GetMoviesByDate(showtime_request)
            # Prepare the response to send back to the client
            response = booking_pb2.MovieSchedule(date=movie_schedule.date)
            response.movie_ids.extend(movie_schedule.movie_ids)
            return response
        except grpc.RpcError as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error contacting Showtime service: {e.details()}")
            return booking_pb2.MovieSchedule()

    def GetUserBookings(self, request, context):
        """Fetch bookings for a specific user."""
        for booking in self.db:
            if booking['userid'] == request.userid:
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
        """Add a new booking for a user."""
        # Fetch movie schedule from Showtime service for the given date
        showtime_movies = self.get_movies_by_date(request.date)

        # If the movie doesn't exist in Showtime for the given date, return an error
        if request.movieid not in showtime_movies['movies']:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details('Movie ID does not exist for the given date')
            return booking_pb2.UserBooking()

        # Add booking logic
        for booking in self.db:
            if booking['userid'] == request.userid:
                for date in booking['dates']:
                    if date['date'] == request.date:
                        if request.movieid not in date['movies']:
                            date['movies'].append(request.movieid)
                        else:
                            context.set_code(grpc.StatusCode.ALREADY_EXISTS)
                            context.set_details('Booking already exists')
                            return booking_pb2.UserBooking()
                        break
                else:
                    booking['dates'].append({'date': request.date, 'movies': [request.movieid]})
                break
        else:
            new_booking = {
                'userid': request.userid,
                'dates': [{'date': request.date, 'movies': [request.movieid]}]
            }
            self.db.append(new_booking)

        return self.GetUserBookings(booking_pb2.UserID(userid=request.userid), context)
    
    def RemoveBooking(self, request, context):
        """Remove a booking for a user."""
        for booking in self.db:
            if booking['userid'] == request.userid:
                for date in booking['dates']:
                    if date['date'] == request.date:
                        if request.movieid in date['movies']:
                            # Remove the movie from the booking
                            date['movies'].remove(request.movieid)

                            # If no movies remain on that date, remove the date
                            if not date['movies']:
                                booking['dates'].remove(date)

                            # If no dates remain for the user, remove the entire booking
                            if not booking['dates']:
                                self.db.remove(booking)

                            # Return updated user bookings
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

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    booking_pb2_grpc.add_BookingServicer_to_server(BookingServicer(), server)
    server.add_insecure_port('[::]:3201')
    print("[INFO] Booking Server running on port 3201")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    print("Starting booking service...")
    serve()