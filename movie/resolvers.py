# resolvers.py

def resolve_movies(obj, info):
    return info.context["movies"]

def resolve_movie(obj, info, id):
    movies = info.context["movies"]
    return next((movie for movie in movies if movie["id"] == id), None)

def resolve_create_movie(obj, info, id, title, rating, director):
    movies = info.context["movies"]
    if any(movie["id"] == id for movie in movies):
        raise ValueError("A movie with this id already exists")
    new_movie = {
        "id": id,
        "title": title,
        "rating": rating,
        "director": director
    }
    movies.append(new_movie)
    return new_movie

def resolve_update_movie_rating(obj, info, id, rating):
    movies = info.context["movies"]
    movie = next((movie for movie in movies if movie["id"] == id), None)
    if movie:
        movie["rating"] = rating
        return movie
    return None

def resolve_delete_movie(obj, info, id):
    movies = info.context["movies"]
    movie = next((movie for movie in movies if movie["id"] == id), None)
    if movie:
        movies.remove(movie)
        return True
    return False