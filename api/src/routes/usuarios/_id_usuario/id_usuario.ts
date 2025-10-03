import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Usuario } from "../../../model/usuariomodel.ts";
import {
  erase,
  getById,
  usuarios,
  update,
} from "../../../services/usuarios-services.ts";
import * as err from "../../../model/errorsmodel.ts";

const rutasID: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.delete(
    "/",
    {
      schema: {
        summary: "Eliminar usuario",
        description: "Aca podras eliminar un usuario",
        tags: ["usuarios"],
        params: Type.Pick(Usuario, ["id_usuario"]),
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.userIsAdmin],
    },
    async (req, reply) => {
      const usuario = await getById(req.params.id_usuario);
      await erase(req.params.id_usuario);
      if (!usuario) throw new err.errorNoEncontrado();
      return reply.code(200).send();
    }
  );
  fastify.put(
    "/",
    {
      schema: {
        summary: "Editar usuario",
        description: "Aca podras editar un usuario",
        tags: ["usuarios"],
        params: Type.Pick(Usuario, ["id_usuario"]),
        body: Type.Omit(Usuario, ["id_usuario"]),
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.userIsAdmin],
    },
    async (req, reply) => {
      const id_usuario = req.params.id_usuario;
      const usuario = req.body;
      if (!usuario) throw new err.errorNoEncontrado();
      if (id_usuario < 0) throw new err.errorDesconocido();
      const cambiado = await update(id_usuario, usuario);
      return cambiado;
    }
  );
};

export default rutasID;
