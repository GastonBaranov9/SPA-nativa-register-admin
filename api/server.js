import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import autoLoad from "@fastify/autoload";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "DELETE", "PUT"],
});

await fastify.register(autoLoad, {
  dir: join(__dirname, "./src/plugins"),
});

await fastify.register(autoLoad, {
  dir: join(__dirname, "src/routes"),
  routeParams: true,
});

await fastify.register(autoLoad, {
  dir: join(__dirname, "./src/login"),
});

try {
  await fastify.register(fastifyFormbody);
  fastify.listen({ port: 4000, host: "::" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
