"use client";

import { useState, useEffect } from "react";
import { User } from "../types";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // For demo purposes, we'll use a fixed user ID
    const userId = 1;
    fetch(`http://localhost:3203/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!user) return <div>Loading user...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      <p className="text-gray-600">Name: {user.name}</p>
      <p className="text-gray-600">Email: {user.email}</p>
    </div>
  );
}
