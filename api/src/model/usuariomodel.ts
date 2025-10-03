import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";

export const Usuario = Type.Object({
  id_usuario: Type.Number(),
  nombre: Type.String(),
  apellido: Type.String(),
  password: Type.String(),
  edad: Type.Number(),
  isAdmin: Type.Boolean(),
});
export type Usuario = Static<typeof Usuario>;

export const UsuarioCrear = Type.Object({
  nombre: Type.String(),
  apellido: Type.String(),
  password: Type.String(),
  edad: Type.Number(),
  isAdmin: Type.Boolean(),
});
export type UsuarioCrear = Static<typeof Usuario>;
