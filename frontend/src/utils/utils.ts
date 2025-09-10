import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5173", 
  withCredentials: true, 
});

export default api;