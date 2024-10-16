from flask import Flask, render_template, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import json
import requests
import grpc
import booking_pb2
import booking_pb2_grpc
import json
from db import MongoDBClient
from bson import json_util

app = Flask(__name__)
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a strong secret key
jwt = JWTManager(app)

PORT = 3203
HOST = '0.0.0.0'

#mongosh --username=root --password=examplepassword

db = MongoDBClient()
users_collection = db.get_collection('users_collection')

# Load data from the JSON file
with open('./data/users.json', "r") as jsf:
    _users = json.load(jsf)["users"]

# Insert the data into the MongoDB collection
if _users:
    if users_collection.count_documents({}) == 0:  # Efficient count query for MongoDB
        users_collection.insert_many(_users)
        print(f"{len(_users)} users inserted successfully!")
    else:
        print("Users collection already populated.")
else:
    print("No users found in the provided data.")

users = list(users_collection.find({}))

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
    users = list(users_collection.find({}))  # Busca todos os usuários
    return make_response(json_util.dumps(users), 200)  # Serializa o resultado em JSON

@app.route("/users/<userid>", methods=['GET'])
@jwt_required()
def get_user(userid):
    user = users_collection.find_one({"id": userid})  # Busca um usuário específico
    if user:
        return make_response(json_util.dumps(user), 200)  # Serializa o resultado em JSON
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
    try:
        with grpc.insecure_channel('booking:3201') as channel:
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

@app.route("/bookings/showtimes", methods=['GET'])
def get_showtimes_from_bookings():
    # Obtendo a data a partir da query string
    date = request.args.get('date')

    if not date:
        return jsonify({"error": "Date is required"}), 400

    try:
        with grpc.insecure_channel('booking:3201') as channel:
            stub = booking_pb2_grpc.BookingStub(channel)

            print(f"-------------- GetShowtimeMovies for Date: {date} --------------")
            
            # Criando uma requisição gRPC com a data fornecida
            showtime_request = booking_pb2.Date(date=date)
            movie_schedule = stub.GetShowtimeMovies(showtime_request)

            # Estrutura de resposta a ser retornada
            showtimes_dict = {
                "date": movie_schedule.date,
                "movie_ids": list(movie_schedule.movie_ids)
            }

            print(f"Movie schedule for {date}: {showtimes_dict}")

            return make_response(jsonify(showtimes_dict), 200)

    except grpc.RpcError as e:
        print(f"gRPC error: {e.code()}, {e.details()}")
        return jsonify({"error": f"Booking service error: {e.details()}"}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    print("Server running in port %s"%(PORT))
    app.run(host=HOST, port=PORT, debug=True)