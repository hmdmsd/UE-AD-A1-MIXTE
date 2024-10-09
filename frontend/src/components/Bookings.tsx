"use client";
import React, { useState, useEffect } from "react";
import { Booking } from "../types";
import { Calendar, Clock, Film } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import Skeleton from "./ui/skeleton";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
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
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <Button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 text-white hover:bg-red-600"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Film className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by booking a movie.
        </p>
        <div className="mt-6">
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Browse Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {booking.movieTitle}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  <time dateTime={booking.showtime}>
                    {new Date(booking.showtime).toLocaleDateString()}
                  </time>
                  <Clock className="ml-4 mr-1 h-4 w-4" />
                  <span>{new Date(booking.showtime).toLocaleTimeString()}</span>
                </div>
              </div>
              <Button className="bg-red-500 text-white hover:bg-red-600">
                Cancel Booking
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
