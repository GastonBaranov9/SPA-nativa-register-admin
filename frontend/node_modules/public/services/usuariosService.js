import { apiService } from "./apiService.js";

export async function getAll() {
  return await apiService("/usuarios");
}

export async function create(usuario) {
  return await apiService("/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
}

export async function erase(id_usuario) {
  return await apiService(`/usuarios/${id_usuario}`, {
    method: "DELETE",
  });
}

export async function getById(id_usuario) {
  return await apiService(`/usuarios/${id_usuario}`, {
    method: "GET",
  });
}

export async function update(id_usuario, data) {
  return await apiService(`/usuarios/${id_usuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: data.nombre,
      apellido: data.apellido,
      edad: data.edad,
    }),
  });
}
