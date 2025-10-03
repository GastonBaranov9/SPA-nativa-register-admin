import { Type } from "@sinclair/typebox";

export const ErrorSchema = Type.Object(
  {
    statusCode: Type.Integer(),
    error: Type.String(),
    message: Type.String(),
    code: Type.Optional(Type.String()),
  },
  {
    title: "Esquema para errores",
  }
);
