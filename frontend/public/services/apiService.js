import { getToken } from "./localStorage.js";

const baseURL = "http://localhost:4000";

export async function apiService(endpoint, options = {}) {
  const token = getToken();

  const headers = { ...(options.headers || {}) };

  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      handleError(response.status);

      throw new Error(`HTTP ${response.status}`);
    }

    if (response.status === 204 || response.status === 205) return null;

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (err) {
    const e = new Error("NETWORK_ERROR");
    e.cause = err;
    throw e;
  }
}

function handleError(status) {
  switch (status) {
    case 400:
      throw new Error("Solicitud incorrecta 400.");
    case 401:
      throw new Error("No autorizado 401. Debes iniciar sesión.");
    case 403:
      throw new Error("No tiene permiso para hacer eso 403.");
    case 404:
      throw new Error("No encontrado 404.");
    default:
      throw new Error(`Error HTTP ${status}`);
  }
}
