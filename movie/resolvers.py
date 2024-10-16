def resolve_movies(_, info):
    movies_collection = info.context["movies"]
    # Fetch all movies and convert to a list
    movies = list(movies_collection.find({}))
    return movies

def resolve_movie(_, info, id):
    movies_collection = info.context["movies"]
    # Find movie by string id
    movie = movies_collection.find_one({"id": id})
    return movie

def resolve_create_movie(_, info, id, title, rating, director):
    movies_collection = info.context["movies"]
    # Check if a movie with the same id already exists
    if movies_collection.find_one({"id": id}):
        raise ValueError("A movie with this ID already exists")
    
    new_movie = {
        "id": id,  # Store UUID as a string
        "title": title,
        "rating": rating,
        "director": director
    }
    
    # Insert the new movie into the collection
    movies_collection.insert_one(new_movie)
    return new_movie

def resolve_update_movie_rating(_, info, id, rating):
    movies_collection = info.context["movies"]
    # Update the movie's rating
    result = movies_collection.find_one_and_update(
        {"id": id},  # Query by string id
        {"$set": {"rating": rating}},
        return_document=True
    )
    return result

def resolve_delete_movie(_, info, id):
    movies_collection = info.context["movies"]
    # Remove the movie by string id
    result = movies_collection.delete_one({"id": id})
    return result.deleted_count > 0
