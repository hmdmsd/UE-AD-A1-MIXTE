"use client";

import { useState, useEffect } from "react";
import { fetchUserShowtimes } from "@/src/lib/api";

interface ShowtimeResponse {
  date: string;
  booked_movie_ids: string[];
  all_movie_ids: string[];
}

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<ShowtimeResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getShowtimes = async () => {
      try {
        // For demo purposes, we're using a hardcoded user ID
        const data = await fetchUserShowtimes("chris_rivers");
        console.log("Fetched showtimes data:", data); // Log the fetched data
        if (data && Array.isArray(data)) {
          setShowtimes(data);
        } else {
          throw new Error("Invalid data structure received from API");
        }
      } catch (err) {
        console.error("Error fetching showtimes:", err);
        setError("Failed to fetch showtimes");
      } finally {
        setLoading(false);
      }
    };

    getShowtimes();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading showtimes...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!showtimes || showtimes.length === 0) {
    return (
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-5">Showtimes</h1>
        <p>No showtimes available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Showtimes</h1>
      <ul className="space-y-4">
        {showtimes.map((showtime) => (
          <li key={showtime.date} className="bg-white shadow rounded-lg p-4">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(showtime.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Your Booked Movies:</strong>{" "}
              {showtime.booked_movie_ids.join(", ") || "None"}
            </p>
            <p>
              <strong>All Available Movies:</strong>{" "}
              {showtime.all_movie_ids.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
