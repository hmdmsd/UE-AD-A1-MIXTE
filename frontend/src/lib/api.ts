// Define the base URL for the API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3203";

// Define types for the API responses
interface User {
  id: string;
  name: string;
  last_active: number;
  email: string; // Added email field
  password?: string; // Optionally include password if needed for certain operations
}

interface Movie {
  id: string;
  title: string;
  rating: number;
  director: string;
}

interface BookingResponse {
  dates: {
    date: string;
    movie_ids: string[];
  }[];
  userid: string;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "An error occurred");
  }
  return response.json();
}

// Helper function to get token from local storage
function getToken() {
  return localStorage.getItem("access_token");
}

// API function to fetch all users
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include the token in the headers
    },
  });
  return handleResponse<User[]>(response);
}

// API function to fetch a single user
export async function fetchUser(userId: string): Promise<User> {
  console.log(getToken());
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include the token in the headers
    },
  });
  return handleResponse<User>(response);
}

// API function to fetch movies for a user
export async function fetchUserMovies(userId: string): Promise<Movie[]> {
  const response = await fetch(`${API_URL}/users/${userId}/movies`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include the token in the headers
    },
  });
  return handleResponse<Movie[]>(response);
}

// API function to fetch bookings for a user
export async function fetchUserBookings(
  userId: string
): Promise<BookingResponse> {
  const response = await fetch(`${API_URL}/users/${userId}/bookings`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return handleResponse<BookingResponse>(response);
}

// API function to fetch all movies (this might need to be implemented on the backend)
export async function fetchMovies(): Promise<Movie[]> {
  const response = await fetch(`${API_URL}/movies`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include the token in the headers
    },
  });
  return handleResponse<Movie[]>(response);
}

// API function to fetch a single movie (this might need to be implemented on the backend)
export async function fetchMovie(movieId: string): Promise<Movie> {
  const response = await fetch(`${API_URL}/movies/${movieId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // Include the token in the headers
    },
  });
  return handleResponse<Movie>(response);
}

// API function to create a booking (this needs to be implemented on the backend)
export async function createBooking(
  userId: string,
  movieId: string,
  date: string
): Promise<Booking> {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`, // Include the token in the headers
    },
    body: JSON.stringify({ userId, movieId, date }),
  });
  return handleResponse<Booking>(response);
}

// API function for user login
export async function login(
  username: string,
  password: string
): Promise<{ access_token: string; user: User }> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse<{ access_token: string; user: User }>(
    response
  );
  // Store the token in local storage
  localStorage.setItem("access_token", data.access_token);
  return data;
}

// API function for user registration
export async function register(
  username: string,
  email: string,
  password: string
): Promise<User> {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse<User>(response);
}
