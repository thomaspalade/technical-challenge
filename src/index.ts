// Config
import { config } from 'dotenv';
config();

// Middlewares
import express from 'express';
const app = express();

app.disable('x-powered-by');
app.enable('trust proxy');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Endpoints
import setupEventsRoutes from './events/routes';
setupEventsRoutes(app);
import util from 'util';

process.on('SIGTERM', () => {
  console.log(`Service received 'SIGTERM'. Initiating graceful shutdown.`);

  const serverStop = util.promisify(server.stop);

  setTimeout(async () => {
    // clean up the cache first
    cleanUpCache(ENV_CONFIG.cacheInstance);
    // then stop the server
    await serverStop();
    console.log(`Service finished graceful shutdown.`);
  }, 4000);
});

// Start Server
import stoppable from 'stoppable';
import { ENV_CONFIG } from './env';
import { cleanUpCache } from './cache/cache';
import { SERVER_TIMEOUT, KEEP_ALIVE_TIMEOUT } from './const';

const server = stoppable(
  app.listen(ENV_CONFIG.port, () => {
    console.log(`Service is listening on port ${ENV_CONFIG.port}.`);
  })
);

server.timeout = SERVER_TIMEOUT;
server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT;

export default server;
