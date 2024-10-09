from flask import Flask, render_template, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import json
import requests

import grpc

import booking_pb2
import booking_pb2_grpc


app = Flask(__name__)
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a strong secret key
jwt = JWTManager(app)

PORT = 3203
HOST = '0.0.0.0'

with open('./data/users.json', "r") as jsf:
    users = json.load(jsf)["users"]

@app.route("/", methods=['GET'])
def home():
    return "<h1 style='color:blue'>Welcome to the users service!</h1>"

@app.route("/login", methods=['POST'])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    
    for user in users:
        if user['id'] == username and user['password'] == password:  # Check credentials
            access_token = create_access_token(identity=user['id'])
            return jsonify(access_token=access_token), 200
    
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/users", methods=['GET'])
@jwt_required()
def get_users():
    return make_response(jsonify(users), 200)

@app.route("/users/<userid>", methods=['GET'])
@jwt_required()
def get_user(userid):
    for user in users:
        if str(user["id"]) == str(userid):
            return make_response(jsonify(user), 200)
    return make_response(jsonify({"error": "User not found"}), 404)

@app.route("/users/<userid>/movies", methods=['GET'])
def get_user_movies(userid):
    for user in users:
        if str(user["id"]) == str(userid):
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
            response = requests.post("http://movie:3200/graphql", json={'query': query})
            movies = response.json()['data']['movies']
            
            # You can add additional logic here to filter movies based on user preferences
            return make_response(jsonify(movies), 200)
    return make_response(jsonify({"error": "User not found"}), 400)

def get_bookings_by_user(stub, userid):
    user_bookings = stub.GetUserBookings(userid)

    bookings_dict = {
        "userid": user_bookings.userid,
        "dates": []
    }

    for date in user_bookings.dates:
        bookings_dict["dates"].append({
            "date": date.date,
            "movie_ids": list(date.movie_ids)
        })

    return bookings_dict

@app.route("/users/<userid>/bookings", methods=['GET'])
def get_user_bookings(userid):
    with grpc.insecure_channel('localhost:3001') as channel:
        stub = booking_pb2_grpc.BookingStub(channel)

        print("-------------- GetUserBookings --------------")
        userid = booking_pb2.UserID(userid=userid)
        user_bookings = get_bookings_by_user(stub, userid)

        print(dict(user_bookings))
        
        return make_response(jsonify(user_bookings), 200)

    channel.close()
    return jsonify({"error": "Backend error"}), 501


if __name__ == "__main__":
    print("Server running in port %s"%(PORT))
    app.run(host=HOST, port=PORT, debug=True)