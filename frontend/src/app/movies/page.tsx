import MovieList from "@/src/components/MovieList";

export default function MoviesPage() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Movies</h1>
      <MovieList />
    </div>
  );
}
