from flask import Flask, render_template, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import json
import requests
import grpc
import booking_pb2
import booking_pb2_grpc
from db import MongoDBClient
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

PORT = int(os.getenv('USER_PORT', 3203))
HOST = os.getenv('USER_HOST', '0.0.0.0')

db = MongoDBClient()
users = db.get_collection('users_collection')

# Initialize gRPC channel for booking service
booking_channel = grpc.insecure_channel(f"{os.getenv('BOOKING_HOST', 'booking')}:{os.getenv('BOOKING_PORT', '3201')}")
booking_stub = booking_pb2_grpc.BookingStub(booking_channel)

# Load data from the JSON file
with open('./data/users.json', "r") as jsf:
    _users = json.load(jsf)["users"]

# Insert the data into the MongoDB collection
if _users:
    if users.count_documents({}) == 0:
        users.insert_many(_users)
        print(f"{len(_users)} users inserted successfully!")
    else:
        print("Users collection already populated.")
else:
    print("No users found in the provided data.")

@app.route("/", methods=['GET'])
def home():
    return "<h1 style='color:blue'>Welcome to the users service!</h1>"

@app.route("/login", methods=['POST'])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    
    user = users.find_one({"id": username, "password": password})
    if user:
        access_token = create_access_token(identity=user['id'])
        return jsonify(access_token=access_token), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/users", methods=['GET'])
@jwt_required()
def get_users():
    user_list = list(users.find({}, {'_id': 0}))
    return make_response(jsonify(user_list), 200)

@app.route("/users/<userid>", methods=['GET'])
@jwt_required()
def get_user(userid):
    user = users.find_one({"id": userid}, {'_id': 0})
    if user:
        return make_response(jsonify(user), 200)
    return make_response(jsonify({"error": "User not found"}), 404)

@app.route("/users/<userid>/movies", methods=['GET'])
def get_user_movies(userid):
    user = users.find_one({"id": userid})
    if user:
        # GraphQL query
        query = """
        {
            movies {
                id
                title
                rating
                director
            }
        }
        """
        response = requests.post(f"http://{os.getenv('MOVIE_HOST', 'movie')}:{os.getenv('MOVIE_PORT', '3200')}/graphql", json={'query': query})
        movies = response.json()['data']['movies']
        
        # You can add additional logic here to filter movies based on user preferences
        return make_response(jsonify(movies), 200)
    return make_response(jsonify({"error": "User not found"}), 400)

@app.route("/users/<userid>/bookings", methods=['GET'])
def get_user_bookings(userid):
    try:
        with grpc.insecure_channel(f"{os.getenv('BOOKING_HOST', 'booking')}:{os.getenv('BOOKING_PORT', '3201')}") as channel:
            stub = booking_pb2_grpc.BookingStub(channel)
            
            print(f"-------------- GetUserBookings for {userid} --------------")
            user_id = booking_pb2.UserID(userid=userid)
            user_bookings = stub.GetUserBookings(user_id)
            
            bookings_dict = {
                "userid": user_bookings.userid,
                "dates": [{
                    "date": date.date,
                    "movie_ids": list(date.movie_ids)
                } for date in user_bookings.dates]
            }
            
            print(f"User bookings: {bookings_dict}")
            
            return make_response(jsonify(bookings_dict), 200)
    except grpc.RpcError as e:
        print(f"gRPC error: {e.code()}, {e.details()}")
        return jsonify({"error": f"Booking service error: {e.details()}"}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/users/<userid>/showtimes", methods=['GET'])
def get_user_showtimes(userid):
    try:
        user_id = booking_pb2.UserID(userid=userid)
        user_bookings_with_showtimes = booking_stub.GetUserBookingsWithShowtimes(user_id)
        
        if not user_bookings_with_showtimes.userid:
            return jsonify({"error": "User not found or no bookings available"}), 404

        showtimes = []
        for date in user_bookings_with_showtimes.dates:
            showtimes.append({
                "date": date.date,
                "booked_movie_ids": list(date.movie_ids),
                "all_movie_ids": list(date.all_movie_ids)
            })

        return make_response(jsonify(showtimes), 200)
    except grpc.RpcError as e:
        print(f"gRPC error: {e.code()}, {e.details()}")
        return jsonify({"error": f"Booking service error: {e.details()}"}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    print(f"Server running in port {PORT}")
    app.run(host=HOST, port=PORT, debug=True)