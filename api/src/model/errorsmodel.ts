import createError from "@fastify/error";

export const errorDesconocido = createError(
  "Equipo5_ERR1",
  "Se ha encontrado un error desconocido ",
  500,
  Error
);
export const errorNoEncontrado = createError(
  "Equipo5_ERR2",
  "No se ha encontrado el elemento ",
  404,
  Error
);
export const errorNoAutenticado = createError(
  "Equipo5_ERR3",
  "Para ejecutar esta acción se requiere autenticación ",
  401,
  Error
);
export const errorFaltanPermisos = createError(
  "Equipo5_ERR4",
  "No tiene permisos suficientes para ejecutar esta acción ",
  403,
  Error
);

export const bdConnectionError = createError(
  "Equipo5_ERR5",
  "Error de conexión a la base de datos",
  503,
  Error
);
