"use client";

import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import { Movie } from "../types";

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch("http://localhost:3200/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          {
            movies {
              id
              title
              rating
              director
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((data) => setMovies(data.data.movies));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Available Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
