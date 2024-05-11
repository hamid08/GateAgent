import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { Express } from 'express-serve-static-core';
import cors from 'cors';
import config from '../../config/config';


export default function expressConfig(app: Express) {
  // security middleware
  app.use(helmet());

  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000
    })
  );

  // Set allowed origins
  const allowedOrigins = config.common.allowedOrigins_Api.split(',');

  // Use CORS middleware
  app.use(cors({
    origin: allowedOrigins
  }));


  app.use((req, res, next) => {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://some-accepted-origin');
    // Request methods you wish to allow
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With, Content-type, Authorization, Cache-control, Pragma'
    );
    // Pass to next layer of middleware
    next();
  });
  app.use(morgan('combined'));
}
