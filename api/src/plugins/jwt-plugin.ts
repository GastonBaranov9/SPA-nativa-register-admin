import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";
import type { FastifyJWTOptions } from "@fastify/jwt";
import type { FastifyRequest, FastifyReply } from "fastify";
import * as err from "../../src/model/errorsmodel.ts";
import { usuarios } from "../services/usuarios-services.ts";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
    userIsAdmin: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
  }
}

export default fastifyPlugin(async function (fastify) {
  const secret = process.env.FASTIFY_SECRET;
  if (!secret) throw err.errorNoEncontrado;

  await fastify.register(fastifyJwt, { secret });
  fastify.decorate(
    "authenticate",
    async function (req: FastifyRequest, rep: FastifyReply) {
      const token = req.cookies.access || null; // cookie "access"
      if (!token) return rep.code(401).send({ error: "No autenticado" });
      try {
        await req.jwtVerify();
      } catch {
        throw err.errorFaltanPermisos;
      }
    }
  );

  fastify.decorate(
    "userIsAdmin",
    async function (req: FastifyRequest, rep: FastifyReply) {
      await (fastify as any).authenticate(req, rep);
      const { sub } = req.user as { sub: number };
      const user = usuarios.find((u) => u.id_usuario === sub);
      if (!user || !user.isAdmin) throw new err.errorNoAutenticado();
    }
  );
});

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: number; isAdmin: Boolean };
    user: { sub: number; roles?: string[] };
  }
}
