/*import { apiService } from "./apiService.js";
import {
  leerUsuariosLS,
  guardarUsuariosLS,
  upsertUsuarioLS,
  borrarUsuarioLS,
  generarIdLocal,
} from "./localStorage.js";

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
      password: data.password,
    }),
  });
}*/

//DEJAR FUNCIONAL SIN BACKEND
// services/usuariosService.js
import { apiService } from "./apiService.js";
import {
  leerUsuariosLS,
  guardarUsuariosLS,
  upsertUsuarioLS,
  borrarUsuarioLS,
  generarIdLocal,
} from "./localStorage.js";

// LISTAR: intenta API; si falla, vuelve al cache local
export async function getAll() {
  try {
    const usuarios = await apiService("/usuarios", { method: "GET" });
    // sincroniza cache
    guardarUsuariosLS(usuarios);
    return usuarios;
  } catch (e) {
    // backend caído → devolvemos cache
    return leerUsuariosLS();
  }
}

//CREAR: API; si falla, crea local con id local negativo
export async function create({ nombre, apellido, edad, password, isAdmin }) {
  try {
    const creado = await apiService("/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        apellido,
        edad: Number(edad) || null,
        password: password || undefined,
        isAdmin: Boolean(),
      }),
    });
    // server ok → upsert en cache con id real
    upsertUsuarioLS(creado);
    return creado;
  } catch (e) {
    // offline → crear local
    const localUser = {
      id_usuario: generarIdLocal(),
      nombre,
      apellido,
      edad: Number(edad) || null,
      password: password || undefined,
      _offline: true,
      isAdmin: Boolean(),
    };
    upsertUsuarioLS(localUser);
    return localUser;
  }
}

//ACTUALIZAR: API; si falla, actualiza en cache (por id o nombre/apellido)
export async function update(id, data) {
  try {
    const actualizado = await apiService(`/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    upsertUsuarioLS(actualizado);
    return actualizado;
  } catch (e) {
    const usuarioLocal = { id_usuario: id, ...data, _offline: true };
    upsertUsuarioLS(usuarioLocal);
    return usuarioLocal;
  }
}
export async function createRegister(usuario) {
  return await apiService("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
}

export async function getById(id_usuario) {
  return await apiService(`/usuarios/${id_usuario}`, {
    method: "GET",
  });
}

//BORRAR: API; si falla, borra del cache
export async function erase(id) {
  try {
    await apiService(`/usuarios/${id}`, { method: "DELETE" });
    borrarUsuarioLS({ id_usuario: id });
    return true;
  } catch (e) {
    borrarUsuarioLS({ id_usuario: id });
    return true;
  }
}
