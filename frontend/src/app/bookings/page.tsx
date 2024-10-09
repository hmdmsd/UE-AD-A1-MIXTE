"use client";

import { useState, useEffect } from "react";
import { fetchUserBookings } from "@/src/lib/api";

interface BookingDate {
  date: string;
  movie_ids: string[];
}

interface BookingResponse {
  dates: BookingDate[];
  userid: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        // For demo purposes, we're using a hardcoded user ID
        const data = await fetchUserBookings("chris_rivers");
        console.log("Fetched bookings data:", data); // Log the fetched data
        if (data && Array.isArray(data.dates)) {
          setBookings(data);
        } else {
          throw new Error("Invalid data structure received from API");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (
    !bookings ||
    !Array.isArray(bookings.dates) ||
    bookings.dates.length === 0
  ) {
    return (
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-5">Your Bookings</h1>
        <p>You have no bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Your Bookings</h1>
      <ul className="space-y-4">
        {bookings.dates.map((bookingDate) => (
          <li key={bookingDate.date} className="bg-white shadow rounded-lg p-4">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(bookingDate.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Movies:</strong> {bookingDate.movie_ids.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
