import express from 'express';
import mongoose from 'mongoose';
import swagger from './swagger';
import cors from 'cors';

import config from './config/config';
import expressConfig from './frameworks/webserver/express';
import routes from './frameworks/webserver/routes/index';
import serverConfig from './frameworks/webserver/server';
import mongoDbConnection from './frameworks/database/mongoDB/connection';
import redisConnection from './frameworks/database/redis/connection';
import { setSocketIo, initConnection } from './frameworks/services/socket/connection';

import gateService from './application/services/gateSettingService';
import userService from './application/services/userService';

import { createServer } from 'http';


const app = express();


const server = createServer(app);

// express.js configuration (middlewares etc.)
expressConfig(app);


// Swagger UI setup
swagger(app);

// routes for each endpoint
routes(app);


//Socket Io
setSocketIo(server);
initConnection();


// server configuration and start
serverConfig(app, mongoose, server, config).startServer();

// DB configuration and connection create
mongoDbConnection(mongoose, config, {
  autoIndex: false,
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  connectTimeoutMS: 360000,
  socketTimeoutMS: 360000,
}).connectToMongo();


const runApplication = async () => {
  await redisConnection;
  await gateService().initGateSetting();
  await userService().createDefaultUser();
}

runApplication();


// Expose app
export default app;
