import { apiService } from "./apiService.js";

export async function register({ nombre, apellido, edad, password }) {
  return await apiService("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, apellido, edad, password }),
  });
}

export async function login({ nombre, password }) {
  const response = await apiService("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, password }),
  });
  const token = response.token;
  if (!token) throw new Error("El servidor no devolvió token.");
  localStorage.setItem("token", token);
  return token;
}
