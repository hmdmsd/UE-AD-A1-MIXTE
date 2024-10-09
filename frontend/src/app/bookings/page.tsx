"use client";

import { useState, useEffect } from "react";
import { fetchUserBookings } from "@/src/lib/api";

interface Booking {
  id: string;
  movieId: string;
  date: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        // For demo purposes, we're using a hardcoded user ID
        const data = await fetchUserBookings("chris_rivers");
        setBookings(data);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Loading bookings...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Your Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="bg-white shadow rounded-lg p-4">
              <p>
                <strong>Booking ID:</strong> {booking.id}
              </p>
              <p>
                <strong>Movie ID:</strong> {booking.movieId}
              </p>
              <p>
                <strong>Date:</strong> {new Date(booking.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
