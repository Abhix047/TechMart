import axios from "axios";

// import.meta.env.VITE_API_URL will pull from your Vercel settings in production,
// and from your local .env file when you are developing on your computer.
const baseURL = import.meta.env.VITE_API_URL 

const API = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true
});

export default API;