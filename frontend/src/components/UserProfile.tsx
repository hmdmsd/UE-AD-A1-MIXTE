"use client";

import React, { useState, useEffect } from "react";
import { fetchUser } from "@/src/lib/api";
import { User } from "@/src/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Edit,
  Activity,
  Clock,
} from "lucide-react";

const LoadingProfile = () => (
  <Card className="w-full max-w-3xl mx-auto bg-gray-800">
    <CardContent className="mt-6">
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-gray-700 animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-[300px] bg-gray-700 rounded animate-pulse mx-auto" />
          <div className="h-4 w-[200px] bg-gray-700 rounded animate-pulse mx-auto" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <Card className="w-full max-w-3xl mx-auto bg-red-900/20 border-red-700">
    <CardContent className="py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900/40">
          <Activity className="h-6 w-6 text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-red-400">Error Occurred</h3>
          <p className="text-red-300">{error}</p>
        </div>
        <Button
          onClick={onRetry}
          className="bg-red-700 text-white hover:bg-red-800 mt-4"
        >
          Try Again
        </Button>
      </div>
    </CardContent>
  </Card>
);

const UserNotFound = () => (
  <Card className="w-full max-w-3xl mx-auto bg-gray-800">
    <CardContent className="py-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700">
          <UserIcon className="h-8 w-8 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-300">
            Profile Not Found
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            We couldn't find the user profile you're looking for. Please check
            the URL and try again.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userId = "chris_rivers";
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

  if (loading) return <LoadingProfile />;
  if (error)
    return (
      <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
    );
  if (!user) return <UserNotFound />;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeSinceLastActive = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    const days = Math.floor(seconds / (3600 * 24));

    if (days > 365) {
      return `${Math.floor(days / 365)} years ago`;
    } else if (days > 30) {
      return `${Math.floor(days / 30)} months ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else {
      return "Today";
    }
  };

  const UserAvatar = ({ name }: { name: string }) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    return (
      <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
        {initials}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100">
        <CardHeader className="relative pb-0">
          <div className="absolute right-6 top-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all hover:scale-105"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <UserAvatar name={user.name} />
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {user.name}
              </CardTitle>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                <Activity className="h-4 w-4" />
                Active User
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700/50 rounded-lg p-1">
              <TabsTrigger
                value="overview"
                className="rounded-md data-[state=active]:bg-blue-600"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-md data-[state=active]:bg-blue-600"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-6">
              <div className="space-y-4 bg-gray-700/30 rounded-lg p-6">
                <div className="flex items-center gap-3 text-gray-200">
                  <div className="p-2 rounded-full bg-gray-700">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <div className="p-2 rounded-full bg-gray-700">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <span>
                    Last active: {getTimeSinceLastActive(user.last_active)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-700/50 border-none">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20">
                        <Activity className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">User ID</p>
                        <p className="text-lg font-semibold text-gray-100">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700/50 border-none">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20">
                        <Calendar className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Member Since</p>
                        <p className="text-lg font-semibold text-gray-100">
                          {formatDate(user.last_active)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="bg-gray-700/30 border-none">
                <CardContent className="py-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-200">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 rounded-full bg-gray-700">
                        <Activity className="h-4 w-4 text-blue-400" />
                      </div>
                      <span>Last login: {formatDate(user.last_active)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
