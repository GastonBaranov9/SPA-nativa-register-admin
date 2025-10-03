const TOKEN_KEY = "token"; // coincide con lo que usa tu UI actual
const STORAGE_KEY = "spa-nativa"; // opcional, si querés cache local de usuarios

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ===== usuarios (cache) =====
export function leerUsuariosLS() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
export function guardarUsuariosLS(usuarios) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios || []));
}

/**
 * Inserta o reemplaza un usuario. Prioriza emparejar por id_usuario si existe.
 * Si no hay id, intenta por (nombre, apellido).
 */
export function upsertUsuarioLS(usuario) {
  const data = leerUsuariosLS();
  const byId = (u) =>
    usuario.id_usuario != null &&
    String(u.id_usuario) === String(usuario.id_usuario);

  const byNombreApe = (u) =>
    u.nombre?.toLowerCase() === usuario.nombre?.toLowerCase() &&
    u.apellido?.toLowerCase() === usuario.apellido?.toLowerCase();

  let i = data.findIndex(byId);
  if (i < 0) i = data.findIndex(byNombreApe);

  if (i >= 0) data[i] = { ...data[i], ...usuario };
  else data.push(usuario);

  guardarUsuariosLS(data);
  return usuario;
}

/** Borra por id_usuario si hay; si no, por (nombre, apellido) */
export function borrarUsuarioLS({ id_usuario, nombre, apellido }) {
  const data = leerUsuariosLS().filter((u) => {
    if (id_usuario != null) {
      return String(u.id_usuario) !== String(id_usuario);
    }
    return (
      u.nombre?.toLowerCase() !== nombre?.toLowerCase() ||
      u.apellido?.toLowerCase() !== apellido?.toLowerCase()
    );
  });
  guardarUsuariosLS(data);
}

/** Genera un id local negativo para items creados offline */
export function generarIdLocal() {
  return -Date.now(); // ej: -1717000000000
}
