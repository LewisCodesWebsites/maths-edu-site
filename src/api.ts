// Utility to get the API base URL depending on environment
const API_BASE = process.env.NODE_ENV === "production"
  ? "https://mathsmastery.onrender.com"
  : "http://localhost:4001";

export default API_BASE;
