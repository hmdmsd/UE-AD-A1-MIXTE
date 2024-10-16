import grpc
from concurrent import futures
import showtime_pb2
import showtime_pb2_grpc
import json
from db import MongoDBClient
import os
from dotenv import load_dotenv

class ShowtimeServicer(showtime_pb2_grpc.ShowtimeServicer):
    def __init__(self):
        # Load environment variables
        load_dotenv()

        # Connect to MongoDB
        self.db = MongoDBClient()
        self.schedule_collection = self.db.get_collection('schedule_collection')

        # Load data from the JSON file if the collection is empty
        with open('./data/times.json', "r") as jsf:
            _schedule = json.load(jsf)["schedule"]
            
        if _schedule:
            if self.schedule_collection.count_documents({}) == 0:
                self.schedule_collection.insert_many(_schedule)
                print(f"{len(_schedule)} schedules inserted successfully!")
            else:
                print("Schedule collection already populated.")
        else:
            print("No schedules found in the provided data.")

    def GetSchedule(self, request, context):
        schedule = showtime_pb2.Schedule()
        cursor = self.schedule_collection.find({})
        for entry in cursor:
            movie_schedule = schedule.schedules.add()
            movie_schedule.date = entry['date']
            movie_schedule.movie_ids.extend(entry['movies'])
        return schedule

    def GetMoviesByDate(self, request, context):
        entry = self.schedule_collection.find_one({"date": request.date})
        if entry:
            return showtime_pb2.MovieSchedule(date=entry['date'], movie_ids=entry['movies'])
        else:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details('No movies found for the given date')
            return showtime_pb2.MovieSchedule()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    showtime_pb2_grpc.add_ShowtimeServicer_to_server(ShowtimeServicer(), server)
    port = os.getenv('SHOWTIME_PORT', '3202')
    server.add_insecure_port(f'[::]:{port}')
    print(f"[INFO] Server running on port {port}")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    print("Entering main function showtime...")
    serve()