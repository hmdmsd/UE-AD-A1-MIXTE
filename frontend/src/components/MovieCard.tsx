import { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
        <p className="text-gray-600">Director: {movie.director}</p>
        <p className="text-gray-600">Rating: {movie.rating}/10</p>
      </div>
      <div className="bg-indigo-600 p-4">
        <button className="w-full bg-white text-indigo-600 font-semibold py-2 px-4 rounded hover:bg-indigo-100 transition duration-300">
          Book Now
        </button>
      </div>
    </div>
  );
}
