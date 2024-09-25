"use client";

import { useState, useEffect } from "react";
import { Booking } from "../types";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3203/users/chris_rivers/bookings`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Could not fetch bookings:", error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <ul className="space-y-2">
          {bookings.map((booking) => (
            <li key={booking.id} className="text-gray-600">
              {booking.movieTitle} - {booking.showtime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
