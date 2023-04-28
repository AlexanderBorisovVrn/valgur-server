import fastify from 'fastify';
import cors from '@fastify/cors';
import { port, mongodbUrl } from './enviroment.js';
import connect from './mongodb/connect.js';
import { userRoutes,propertyRoutes }from './routes.js';

export const server = fastify({ logger: true });

await server.register(cors, {})
server.register(userRoutes,{prefix:'/api/v1/users'})
server.register(propertyRoutes,{prefix:'/api/v1/properties'})


async function start() {
  try {
    connect(mongodbUrl)
    server.listen({ port })
    console.log("Server started on " + port + ' port');
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }

}

start();