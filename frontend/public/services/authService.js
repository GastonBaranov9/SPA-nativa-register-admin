import { apiService } from "./apiService.js";
import { setToken } from "./localStorage.js";

export async function register({ nombre, apellido, edad, password, isAdmin }) {
  return await apiService("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, apellido, edad, password, isAdmin }),
  });
}

export async function login({ nombre, password }) {
  const response = await apiService("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, password }),
  });
  const token = response?.token;
  if (!token) throw new Error("El servidor no devolvió token.");
  setToken(token);
  return token;
}
