import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Usuario } from "../../model/usuariomodel.ts";
import "../../plugins/jwt-plugin.ts";
import { usuarios, create } from "../../services/usuarios-services.ts";
import { UsuarioCrear } from "../../model/usuariomodel.ts";
let nuevoID = usuarios.length + 1;
const rutas: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Obtener usuarios",
        description: "Aca obtendremos todos los usuarios registrados",
        tags: ["usuarios"],
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],

      preHandler: [fastify.userIsAdmin],
    },
    async (req, reply) => {
      /*
      const cookie = serialize("lang", "en", {
        maxAge: 60_000,
      });

      reply.header("Set-Cookie", cookie);

      reply.send("Language set!");*/

      /*
      reply.setCookie("lang", "en", {
        maxAge: 60, // segundos (no 60_000)
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });*/

      return reply.code(200).send(usuarios);
    }
  );
  fastify.post(
    "/",
    {
      schema: {
        summary: "Agregar usuario",
        description: "Aqui podras agregar un usuario",
        tags: ["usuarios"],
        body: UsuarioCrear,
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],

      preHandler: [fastify.userIsAdmin],
    },
    async (req, reply) => {
      const nuevo = await create(req.body as Usuario);
      return reply.code(201).send(nuevo);
    }
  );
};

export default rutas;
