// Utility to get the API base URL depending on environment
const API_BASE = process.env.NODE_ENV === "production"
  ? "https://mathsmastery.onrender.com"
  : "http://localhost:4002"; // Changed from 4001 to 4002 to match server port

export default API_BASE;
