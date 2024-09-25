export interface Movie {
  id: number;
  title: string;
  rating: number;
  director: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Booking {
  id: number;
  movieTitle: string;
  showtime: string;
}
