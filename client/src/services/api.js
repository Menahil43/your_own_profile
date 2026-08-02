import axios from "axios";

/**
 * Central Axios instance.
 * In development the Vite dev server proxies /api to the Express server,
 * so relative URLs work without extra config.
 *
 * Note: we intentionally do NOT set a Content-Type header here. When a
 * FormData payload is sent, Axios lets the browser set the correct
 * `multipart/form-data; boundary=...` header automatically.
 */
const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

export default api;

