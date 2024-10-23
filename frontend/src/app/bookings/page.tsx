"use client";

import { useState, useEffect } from "react";
import { fetchUserBookings } from "@/src/lib/api";
import { Calendar, Clock, Film } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import Skeleton from "@/src/components/ui/skeleton";

interface BookingDate {
  date: string;
  movie_ids: string[];
}

interface BookingResponse {
  dates: BookingDate[];
  userid: string;
}

// Utility function to format yyyymmdd to Date object
const formatYYYYMMDD = (dateString: string) => {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return new Date(`${year}-${month}-${day}`);
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchUserBookings("chris_rivers");
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
    return (
      <div className="container mx-auto mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Your Bookings</h1>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-4 w-32 bg-muted/60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full bg-muted/60" />
              <Skeleton className="h-4 w-3/4 mt-2 bg-muted/60" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-10">
        <Alert
          variant="destructive"
          className="border-destructive/50 bg-destructive/10"
        >
          <AlertTitle className="text-destructive-foreground">Error</AlertTitle>
          <AlertDescription className="text-destructive-foreground/90">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (
    !bookings ||
    !Array.isArray(bookings.dates) ||
    bookings.dates.length === 0
  ) {
    return (
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Your Bookings
        </h1>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">No Bookings Found</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              You haven't made any bookings yet. Check out our latest movies and
              book your first show!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Your Bookings</h1>
        <span className="text-sm text-muted-foreground/80 bg-muted/30 px-3 py-1 rounded-full">
          Total bookings: {bookings.dates.length}
        </span>
      </div>

      <div className="grid gap-4">
        {bookings.dates.map((bookingDate) => {
          const date = formatYYYYMMDD(bookingDate.date);
          return (
            <Card
              key={bookingDate.date}
              className="hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 group"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
                    <CardTitle className="text-lg text-foreground">
                      {date.toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground/80 bg-muted/20 px-2 py-1 rounded-full">
                    <Clock className="h-4 w-4 mr-1 text-primary/80" />
                    {date.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-2">
                  <Film className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground/90">Movies</div>
                    <div className="text-sm text-muted-foreground/80">
                      {bookingDate.movie_ids.map((movieId, index) => (
                        <span
                          key={movieId}
                          className="hover:text-primary transition-colors"
                        >
                          {movieId}
                          {index < bookingDate.movie_ids.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
