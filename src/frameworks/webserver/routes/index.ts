import gateController from '../../../adapters/gateController';
import { Express } from 'express';

import gateSettingRoute from './gateSettingRoute';
import authRoute from './authRoute';
import userRoute from './userRoute';
import socketTestRoute from './socketTestRoute';
import operatorRoute from './operatorRoute';

import {faildResult,successResult} from '../../../application/utils/apiResult';

export default async function routes(app: Express) {


  app.get('/', function(req, res){
    res.status(200).send(successResult('به سرویس گیت هوشمند خوش آمدید'));
  });

  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Returns API operational status
   *     responses:
   *       200:
   *         description: API is running
   */
  app.get('/healthcheck', (req, res) => res.status(200).send(successResult()));


  /**
   * @swagger
   * /api/gate/rfidAntenna:
   *   get:
   *     description: دریافت لیست آنتن های RFID 
   *     responses:
   *       200:
   *         description: عملیات با موفقیت انجام شد
   */

  // Gate
  app.get('/api/gate/rfidAntenna', gateController().getTerminals);


  /**
  * @swagger
  * /api/gate/cameras:
  *   get:
  *     description: دریافت لیست دوربین ها
  *     responses:
  *       200:
  *         description: عملیات با موفقیت انجام شد
  */
  app.get('/api/gate/cameras', gateController().getCameras);


  gateSettingRoute(app);
  authRoute(app);
  userRoute(app);
  socketTestRoute(app);
  operatorRoute(app);

  // 404 Error Handling Middleware
  app.use((req, res, next) => {
    console.log(`404 Error: Request method: ${req.method}, Request URL: ${req.url}`);
    res.status(404).send(faildResult('آدرس درخواستی یافت نشد'));
  });

}