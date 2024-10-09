"use client";

import React, { useState, useEffect } from "react";
import { fetchUser } from "@/src/lib/api";
import { User } from "@/src/types";

import { Button } from "@/src/components/ui/button";
import { User as UserIcon, Mail, Calendar, Edit } from "lucide-react";
import Skeleton from "./ui/skeleton";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = "chris_rivers"; // Ensure this user ID exists
        const data = await fetchUser(userId);
        setUser(data);
      } catch (err) {
        setError("Failed to fetch user data. Please try again later.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
        <Skeleton className="h-4 w-[250px] bg-gray-700" />
        <Skeleton className="h-4 w-[200px] bg-gray-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <Button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-700 text-white hover:bg-red-800"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <UserIcon className="mx-auto h-12 w-12 text-gray-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-300">
          User not found
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          The requested user profile could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">User Profile</h2>
        <Button className="flex items-center bg-blue-600 text-white hover:bg-blue-700">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <UserIcon className="h-6 w-6 text-gray-400 mr-2" />
          <p>
            <strong>Name:</strong> {user.name}
          </p>
        </div>
        <div className="flex items-center">
          <Mail className="h-6 w-6 text-gray-400 mr-2" />
          <p>
            <strong>Email:</strong> {user.email || "Not provided"}
          </p>
        </div>
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-gray-400 mr-2" />
          <p>
            <strong>Last Active:</strong>{" "}
            {new Date(user.last_active * 1000).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Account Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-400">
              {user.bookings_count || 0}
            </p>
            <p className="text-sm text-gray-300">Total Bookings</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-400">
              {user.favorite_genres?.length || 0}
            </p>
            <p className="text-sm text-gray-300">Favorite Genres</p>
          </div>
        </div>
      </div>
    </div>
  );
}
