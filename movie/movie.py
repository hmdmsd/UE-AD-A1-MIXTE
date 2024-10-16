from ariadne import graphql_sync, make_executable_schema, load_schema_from_path, ObjectType, QueryType, MutationType
from flask import Flask, request, jsonify, make_response
import resolvers as r
import json
from flask_cors import CORS
from common.db import MongoDBClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

PORT = int(os.getenv('MOVIE_PORT', 3200))
HOST = os.getenv('MOVIE_HOST', '0.0.0.0')
app = Flask(__name__)
CORS(app)

db = MongoDBClient()
movies = db.get_collection('movies_collection')

with open('./data/movies.json', 'r') as jsf:
    _movies = json.load(jsf)["movies"]

if _movies:
    if movies.count_documents({}) == 0:
        movies.insert_many(_movies)
        print(f"{len(_movies)} movies inserted successfully!")
    else:
        print("Movies collection already populated.")
else:
    print("No movies found in the provided data.")

# Create type definitions
type_defs = load_schema_from_path("movie.graphql")

# Create types
query = QueryType()
mutation = MutationType()
movie = ObjectType("Movie")

# Add resolvers
query.set_field("movies", r.resolve_movies)
query.set_field("movie", r.resolve_movie)
mutation.set_field("createMovie", r.resolve_create_movie)
mutation.set_field("updateMovieRating", r.resolve_update_movie_rating)
mutation.set_field("deleteMovie", r.resolve_delete_movie)

# Create executable schema
schema = make_executable_schema(type_defs, query, mutation, movie)

# Root message
@app.route("/", methods=['GET'])
def home():
    return make_response("<h1 style='color:blue'>Welcome to the Movie service!</h1>", 200)

# GraphQL entry point
@app.route('/graphql', methods=['POST'])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value={"movies": movies},
        debug=app.debug
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

if __name__ == "__main__":
    print(f"Server running on port {PORT}")
    app.run(host=HOST, port=PORT)