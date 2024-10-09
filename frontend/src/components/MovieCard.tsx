import React from "react";
import { Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Movie } from "@/src/types";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <img
        src={movie.posterUrl || "/placeholder-movie.jpg"}
        alt={`${movie.title} poster`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-1">
          {movie.title}
        </h2>
        <p className="text-gray-600 mb-2 line-clamp-1">
          Director: {movie.director}
        </p>
        <div className="flex items-center mb-2">
          <Star className="w-5 h-5 text-yellow-500 mr-1" />
          <span>{movie.rating.toFixed(1)}/10</span>
        </div>
        <div className="flex items-center mb-2">
          <Clock className="w-5 h-5 text-gray-500 mr-1" />
          <span>{movie.duration} mins</span>
        </div>
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-gray-500 mr-1" />
          <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
        </div>
        <Button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
          Book Now
        </Button>
      </div>
    </div>
  );
}
