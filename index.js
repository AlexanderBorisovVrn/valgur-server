import fastify from 'fastify';
import cors from '@fastify/cors';
import { port,mongodbUrl } from './enviroment.js';
import connect from './mongodb/connect.js';



const server = fastify({ logger: true });

await server.register(cors, {})

server.get('/',(req,res)=>{
    res.send('hello world')
})


async function start() {
  try {
      connect(mongodbUrl)
     server.listen({
          port
      })
      console.log("Server started on " + port + ' port');
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }

}

start();