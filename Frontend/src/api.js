// src/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // default import

const USER_KEY = "user";

const baseURL = (() => {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return "http://localhost:5000";
})();

const API = axios.create({ baseURL });

/* -------------------------------
   Storage helpers
--------------------------------*/
export const setUserInStorage = (userObj) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
  } catch (err) {
    // ignore storage errors
    console.warn("setUserInStorage failed", err);
  }
};

export const clearAuth = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.warn("clearAuth failed", err);
  }
};

export const getToken = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    const stored = raw ? JSON.parse(raw) : null;
    return stored?.token || null;
  } catch {
    return null;
  }
};

/* --------------------------------------------------
   Attach latest Bearer token on every outgoing call
-------------------------------------------------- */
API.interceptors.request.use(
  (cfg) => {
    try {
      const token = getToken();
      if (token) {
        cfg.headers = {
          ...(cfg.headers || {}),
          Authorization: `Bearer ${token}`,
        };
      }
    } catch {
      // ignore
    }
    return cfg;
  },
  (error) => Promise.reject(error)
);

/* --------------------------------------------------
   Global 401 handler: clear trash + redirect once
-------------------------------------------------- */
let alreadyRedirected = false;

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !alreadyRedirected) {
      alreadyRedirected = true;
      clearAuth();
      // use replace so history doesn't keep the login redirect
      window.location.replace("/login");
    }
    return Promise.reject(err);
  }
);

/* --------------------------------------------------
   Helper: decode latest token payload (id, name, role)
   - returns null if no token or token expired
   - NOTE: jwtDecode does NOT verify signature — it only decodes
-------------------------------------------------- */
export const getAuthPayload = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const payload = jwtDecode(token);

    // expiry check (exp is in seconds per JWT)
    if (payload?.exp && typeof payload.exp === "number") {
      if (payload.exp * 1000 < Date.now()) {
        // token expired -> clear and return null
        clearAuth();
        return null;
      }
    }

    return payload;
  } catch (err) {
    // treat any decode/parsing issue as unauthenticated
    console.warn("getAuthPayload failed", err);
    return null;
  }
};

export const isAuthenticated = () => !!getAuthPayload();

export default API;
