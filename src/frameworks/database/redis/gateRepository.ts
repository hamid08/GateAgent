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
      await redisClient.hSet('myhash', 'field1', 'value1', 'EX', 60, function (err: any, reply: any) {
        console.log(reply); // 1
      });

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

  // const redis = require('redis');
  // const client = redis.createClient();

  // client.on('connect', function() {
  //   console.log('Connected to Redis...');

  //   // Search for keys that match the pattern 'vehicle_*'
  //   client.keys('vehicle_*', function(err, keys) {
  //     if (err) return console.log(err);

  //     // Check if any of the keys contain the value 'F3'
  //     const keyWithF3 = keys.find(key => {
  //       client.get(key, function(err, value) {
  //         if (value && JSON.parse(value).name === 'F3') {
  //           console.log(`Found item with F3: ${key}`);
  //         }
  //       });
  //     });

  //     // Check if any of the keys contain the value '193b56895'
  //     const keyWith193b56895 = keys.find(key => {
  //       client.get(key, function(err, value) {
  //         if (value && JSON.parse(value).id.toString() === '193b56895') {
  //           console.log(`Found item with 193b56895: ${key}`);
  //         }
  //       });
  //     });
  //   });
  // });


  return {
    setVehicles,
    testRedisConnection,

  }
}
