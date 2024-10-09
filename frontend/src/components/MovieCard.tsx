import React from "react";
import { Star, Clock, Calendar, Tag } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Movie } from "@/src/types";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="relative">
        <img
          src={movie.posterUrl || "/movies/squid-game.jpg"}
          alt={`${movie.title} poster`}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-0 left-0 m-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {movie.genre}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
          <h2 className="text-xl font-bold text-white mb-1 line-clamp-1">
            {movie.title}
          </h2>
          <p className="text-gray-300 text-sm line-clamp-1">
            Directed by {movie.director}
          </p>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-1" />
            <span className="text-white font-semibold">
              {movie.rating.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm ml-1">/10</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{movie.duration} mins</span>
          </div>
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <Tag className="w-4 h-4 mr-2" />
          <span>{movie.mpaaRating}</span>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-300">
          Book Now
        </Button>
      </div>
    </div>
  );
}
