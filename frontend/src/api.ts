import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust this URL if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Fetch users (Example GET request)
export const fetchUsers = async () => {
  const response = await API.get("/users"); // Adjust endpoint
  return response.data;
};

// Create a new user (Example POST request)
export const createUser = async (userData: { name: string; email: string }) => {
  const response = await API.post("/users", userData);
  return response.data;
};

// Update user details (Example PUT request)
export const updateUser = async (id: string, userData: { name: string; email: string }) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data;
};

// Delete a user (Example DELETE request)
export const deleteUser = async (id: string) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};

export default API;
