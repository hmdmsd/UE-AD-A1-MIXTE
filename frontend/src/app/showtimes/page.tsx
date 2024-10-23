"use client";

import { useState, useEffect } from "react";
import { fetchUserShowtimes } from "@/src/lib/api";
import { Card, CardContent } from "@/src/components/ui/card";
import { Calendar, Film, AlertCircle, CheckCircle2 } from "lucide-react";

interface ShowtimeResponse {
  date: string;
  booked_movie_ids: string[];
  all_movie_ids: string[];
}

const LoadingState = () => (
  <div className="container mx-auto mt-10 max-w-4xl">
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-50">
            <CardContent className="p-6 space-y-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="container mx-auto mt-10 max-w-4xl">
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-red-700">
            Error Loading Showtimes
          </h2>
          <p className="text-red-600">{message}</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const EmptyState = () => (
  <div className="container mx-auto mt-10 max-w-4xl">
    <Card className="bg-gray-50">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Film className="h-12 w-12 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700">
            No Showtimes Available
          </h2>
          <p className="text-gray-500">
            Check back later for upcoming movie showtimes.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<ShowtimeResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getShowtimes = async () => {
      try {
        const data = await fetchUserShowtimes("chris_rivers");
        if (data && Array.isArray(data)) {
          setShowtimes(data);
        } else {
          throw new Error("Invalid data structure received from API");
        }
      } catch (err) {
        console.error("Error fetching showtimes:", err);
        setError("Failed to fetch showtimes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getShowtimes();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!showtimes || showtimes.length === 0) return <EmptyState />;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto mt-10 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Your Showtimes</h1>
      </div>

      <div className="space-y-6">
        {showtimes.map((showtime) => (
          <Card
            key={showtime.date}
            className="bg-white hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  {formatDate(showtime.date)}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Your Booked Movies
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      {showtime.booked_movie_ids.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {showtime.booked_movie_ids.map((movieId) => (
                            <span
                              key={movieId}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                            >
                              {movieId}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No bookings for this date
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <Film className="h-4 w-4 text-blue-500" />
                      Available Movies
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex flex-wrap gap-2">
                        {showtime.all_movie_ids.map((movieId) => (
                          <span
                            key={movieId}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                              showtime.booked_movie_ids.includes(movieId)
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {movieId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
