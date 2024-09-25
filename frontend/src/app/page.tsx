import MovieList from "../components/MovieList";
import UserProfile from "../components/UserProfile";
import Bookings from "../components/Bookings";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">
        Movie Booking App
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <MovieList />
        </div>
        <div className="space-y-8">
          <UserProfile />
          <Bookings />
        </div>
      </div>
    </main>
  );
}
