import axios from "axios";

// import.meta.env.VITE_API_URL will pull from your Vercel settings in production,
// and from your local .env file when you are developing on your computer.
import { API_URL } from "../config";

const API = axios.create({
  baseURL: API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`,
  withCredentials: true
});

export default API;