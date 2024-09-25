import grpc
from concurrent import futures
import booking_pb2
import booking_pb2_grpc
import json

class BookingServicer(booking_pb2_grpc.BookingServicer):
    def __init__(self):
        with open('{}/data/bookings.json'.format("."), "r") as jsf:
            self.db = json.load(jsf)["bookings"]

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

    def GetUserBookings(self, request, context):
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

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    booking_pb2_grpc.add_BookingServicer_to_server(BookingServicer(), server)
    server.add_insecure_port('[::]:3001')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()