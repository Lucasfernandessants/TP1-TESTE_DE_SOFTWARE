import Fastify from "fastify";
import path from "node:path";
import { fileURLToPath } from "node:url";
import env from "./config/env.js";
import loggerConfig from "./config/logger.js";
import routes from "./routes/routes.js";
import dbConnector from "./config/db.js";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "@fastify/formbody";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createServer = async () => {
  const fastify = Fastify({
    logger: loggerConfig,
  });

  fastify.addHook("onRequest", async (request, reply) => {
    request.log.info(`Incoming request: ${request.method} ${request.url}`);
  });

  fastify.addHook("onResponse", async (request, reply) => {
    request.log.info(
      `Request completed: ${request.method} ${request.url} - Status ${reply.statusCode}`
    );
  });

  // Registrando plugins
  await fastify.register(fastifyCors);
  await fastify.register(fastifyHelmet, {
    // Desabilita o contentSecurityPolicy se estiver causando problemas com EJS/inline styles
    // Em produção, isso deve ser configurado corretamente, não desabilitado.
    contentSecurityPolicy: false,
  });
  await fastify.register(fastifyCompress);
  await fastify.register(fastifyGracefulShutdown);
  await fastify.register(fastifyFormbody);

  await fastify.register(fastifyView, {
    engine: {
      ejs,
    },
    root: path.join(__dirname, "views"),
    viewExt: "ejs",
    layout: "layout.ejs",
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/public/",
  });

  fastify.register(dbConnector);

  await fastify.register(routes);

  return fastify;
};

const start = async () => {
  try {
    const server = await createServer();
    await server.listen({ port: env.port, host: "0.0.0.0" });
  } catch (err) {
    // Usar o logger do Fastify se ele já estiver instanciado, ou console.error
    console.error(err);
    process.exit(1);
  }
};

// Inicia o servidor
start();
