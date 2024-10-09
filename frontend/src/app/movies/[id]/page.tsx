"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchMovie } from "@/src/lib/api";

interface Movie {
  id: string;
  title: string;
  director: string;
  rating: number;
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const data = await fetchMovie(id as string);
        setMovie(data);
      } catch (err) {
        setError("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };

    getMovie();
  }, [id]);

  if (loading)
    return <div className="text-center mt-10">Loading movie details...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!movie) return <div className="text-center mt-10">Movie not found</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">{movie.title}</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="mb-2">
          <strong>Director:</strong> {movie.director}
        </p>
        <p className="mb-4">
          <strong>Rating:</strong> {movie.rating}/10
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Book Now
        </button>
      </div>
    </div>
  );
}
