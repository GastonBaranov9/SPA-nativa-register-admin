import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { dirname, join } from "path";

const server = fastify({
  logger: true,
});

const listenOptions = {
  host: "::",
  port: 3000,
};

const rutaPublica = join(dirname(process.argv[1]), "public");

server.register(fastifyStatic, {
  root: rutaPublica,
  prefix: "/",
});

try {
  await server.listen(listenOptions);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
