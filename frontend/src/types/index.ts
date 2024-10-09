export interface User {
  id: string;
  name: string;
  last_active: number;
}

export interface Movie {
  id: string;
  title: string;
  rating: number;
  director: string;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  date: string;
}
