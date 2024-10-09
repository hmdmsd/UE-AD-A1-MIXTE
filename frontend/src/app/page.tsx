import React from "react";
import MovieList from "@/src/components/MovieList";
import { Search, Ticket } from "lucide-react";
import { Button } from "../components/ui/button";

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "#4338ca", stopOpacity: 0.2 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "#6366f1", stopOpacity: 0.1 }}
          />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
      <g className="animate-float">
        {[...Array(20)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 100 + "%"}
            cy={Math.random() * 100 + "%"}
            r={Math.random() * 2 + 1}
            fill="#ffffff"
            opacity={Math.random() * 0.3 + 0.1}
          />
        ))}
      </g>
    </svg>
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundSize: "20px 20px",
      }}
    ></div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-4 lg:px-12 py-12 space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
            Welcome to MovieBook
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover, book, and experience the magic of cinema with ease.
          </p>
          <div className="flex justify-center space-x-4 mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center transition-all duration-300 transform hover:scale-105">
              <Search className="mr-2 h-5 w-5" />
              Find Movies
            </Button>
            <Button className="bg-transparent text-blue-400 border border-blue-400 hover:bg-blue-400 hover:text-white flex items-center transition-all duration-300 transform hover:scale-105">
              <Ticket className="mr-2 h-5 w-5" />
              My Bookings
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 shadow-2xl rounded-lg p-8 mt-12 border border-gray-700 transition-all duration-300 hover:shadow-blue-500/20">
          <h2 className="text-3xl font-semibold text-blue-400 text-center mb-8">
            Featured Movies
          </h2>
          <MovieList />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {["Wide Selection", "Easy Booking", "Exclusive Offers"].map(
            (feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-400">
                  {feature}
                </h3>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
