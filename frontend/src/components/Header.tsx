"use client";

import React, { useState, useEffect } from "react";
import { Film, Home, User, Ticket, Search, Bell, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/src/lib/utils";
import { Input } from "./ui/input";
import Link from "next/link";

const NavLink = ({ href, icon: Icon, label, onClick, isActive }) => (
  <Link
    href={href}
    className={cn(
      "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
      isActive
        ? "text-white bg-gray-700"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    )}
    onClick={onClick}
  >
    <Icon className="w-5 h-5 mr-2" />
    <span>{label}</span>
  </Link>
);

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/movies", icon: Film, label: "Movies" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/bookings", icon: Ticket, label: "Bookings" },
    { href: "/showtimes", icon: Ticket, label: "Showtimes" },
  ];

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "bg-gray-900 shadow-lg sticky top-0 z-50 transition-all duration-300",
        isScrolled && "bg-opacity-90 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <Film className="h-8 w-8 text-indigo-500 group-hover:text-indigo-400 transition-colors duration-200" />
            </Link>
            <nav className="hidden md:flex ml-10 space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  isActive={activeRoute === item.href}
                  onClick={() => setActiveRoute(item.href)}
                />
              ))}
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/login">
              <Button
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                Login
              </Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-700 hover:text-white mr-2"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {isSearchOpen && (
        <div className="bg-gray-800 py-3 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <Input
                type="text"
                placeholder="Search movies..."
                className="w-full px-4 py-2 pr-10 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      )}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 py-4 px-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                isActive={activeRoute === item.href}
                onClick={() => {
                  setActiveRoute(item.href);
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}
            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white transition-colors duration-200 w-full"
              >
                Login
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
