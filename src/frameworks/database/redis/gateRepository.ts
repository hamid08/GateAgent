import redisConnection from "./connection";
import { VehicleModel } from '../../../application/models/vehicleModels';
import moment from 'moment';
import { TagDataModel } from '../../../application/models/smartGateModels';
import { createClient } from 'redis';

const vehicleKey = (plaqueNo: string): string => `Vehicle_${plaqueNo}`;


export default function gateRepository() {

  if (!redisConnection.connection)
    redisConnection.connect();
  const redisClient = redisConnection.connection;

  async function testRedisConnection(): Promise<boolean> {
    try {
      await redisClient.hSet('myhash', 'field1', 'value1');
      await redisClient.expire('myhash', 10);

      return true;
    } catch (error) {
      return false;

    }
  }


  async function setVehicles(vehicles: VehicleModel[]) {
    try {
      vehicles.forEach(async (vehicle) => {
        await redisClient.hSet(vehicleKey(vehicle.plaqueNo), "data", JSON.stringify(vehicle));
        var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
        console.info(`${vehicleKey(vehicle.plaqueNo)} upserted on redis ${dateFormat}`);

      });

    } catch (error) {
      console.error(error);
    }

  };




  return {
    setVehicles,
    testRedisConnection,

  }
}
