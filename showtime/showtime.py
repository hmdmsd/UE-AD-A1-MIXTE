import grpc
from concurrent import futures
import showtime_pb2
import showtime_pb2_grpc
import json

class ShowtimeServicer(showtime_pb2_grpc.ShowtimeServicer):
    def __init__(self, port):
        with open('{}/data/times.json'.format("."), "r") as jsf:
            self.db = json.load(jsf)["schedule"]
        self.port = port

    def GetSchedule(self, request, context):
        schedule = showtime_pb2.Schedule()
        for entry in self.db:
            movie_schedule = schedule.schedules.add()
            movie_schedule.date = entry['date']
            movie_schedule.movie_ids.extend(entry['movies'])
        return schedule

    def GetMoviesByDate(self, request, context):
        for entry in self.db:
            if entry['date'] == request.date:
                return showtime_pb2.MovieSchedule(date=entry['date'], movie_ids=entry['movies'])
        context.set_code(grpc.StatusCode.NOT_FOUND)
        context.set_details('No movies found for the given date')
        return showtime_pb2.MovieSchedule()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    showtime_pb2_grpc.add_ShowtimeServicer_to_server(ShowtimeServicer('3202'), server)
    server.add_insecure_port('[::]:3202')
    print("[INFO] Server running on port 3202")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    print("Entering main function showtime...")
    serve()