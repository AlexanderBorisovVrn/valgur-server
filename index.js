import fastify from "fastify";
import cors from "@fastify/cors";
import { port, mongodbUrl } from "./enviroment.js";
import connect from "./mongodb/connect.js";
import { userRoutes, propertyRoutes } from "./routes.js";
import setCookie from "@fastify/cookie";

export const server = fastify({ logger: true, bodyLimit: 2048576 });

await server.register(cors, {});
server.register(userRoutes, { prefix: "/api/v1/users" });
server.register(propertyRoutes, { prefix: "/api/v1/properties" });
server.register(setCookie, {
  secret: "my-secret", // for cookies signature
  hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {}, // options for parsing cookies
});

      async function start() {
  try {
    connect(mongodbUrl);
    server.listen({ port });
    console.log("Server started on " + port + " port");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
