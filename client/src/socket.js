import { io } from "socket.io-client";
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const socket = io(baseURL, { autoConnect: true });
