import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { Usuario, UsuarioCrear } from "../model/usuariomodel.ts";
import { create, usuarios } from "../services/usuarios-services.ts";

const AuthResponse = Type.Object({
  token: Type.String(),
});

export const auth: FastifyPluginAsyncTypebox = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/login",
    {
      schema: {
        summary: "Autorizar",
        description: "Daremos autorizacion a un usuario ",
        tags: ["auth"],
        body: Type.Object({
          nombre: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (req, reply) => {
      const { nombre, password } = req.body;
      const usuarioExiste = usuarios.find(
        (u) => u.nombre === nombre && u.password === password
      );
      if (!usuarioExiste) {
        return reply.code(401).send({ error: "Credenciales inválidas" });
      }

      if (!usuarioExiste.isAdmin) {
        return reply.code(403).send({ error: "Se requiere ser administrador" });
      }

      const payload = {
        sub: usuarioExiste.id_usuario,
        nombre: usuarioExiste.nombre,
        isAdmin: usuarioExiste.isAdmin,
      };

      const token = fastify.jwt.sign(payload);

      reply.setCookie("access", token, {
        httpOnly: true,
        // ⚠️ en producción poné true y serví por HTTPS:
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1h (segundos)
      });

      return reply.send({ ok: true });
    }
  );
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Registro + login",
        body: UsuarioCrear,
        response: {
          201: AuthResponse,
          401: Type.Object({ error: Type.String() }),
        },
      },
    },
    async (req, reply) => {
      const nuevo = await create(req.body as Usuario);

      const payload = {
        sub: nuevo.id_usuario,
        nombre: nuevo.nombre,
        isAdmin: nuevo.isAdmin,
      };

      const token = fastify.jwt.sign(payload);

      return { token };
    }
  );
};

export default auth;
