import _gateService from '../application/services/gateService';
// import socketConnection from '../frameworks/services/socket/connection';
import { faildResult, successResult } from '../application/utils/apiResult';

import {
  SyncDataType
} from '../application/enums/gateEnum';


export default function gateController() {

  const getTerminals = async (req: any, res: any, next: any) => {
    try {

      res.status(200).send(await _gateService().gateRfidAntennas());
    } catch (error: any) {
      console.error(error);
      res.status(200).send(faildResult(error.message));
    }
  };



  const getCameras = async (req: any, res: any, next: any) => {
    try {
      res.status(200).send(await _gateService().gateCameras());
    } catch (error: any) {
      console.error(error);
      res.status(200).send(faildResult(error.message));
    }
  };


  return {
    getTerminals,
    getCameras,
  }

}