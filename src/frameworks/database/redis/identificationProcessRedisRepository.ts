import redisConnection from "./connection";
import moment from 'moment';
import { 

    RFIDCacheDataModel,
    HFCacheDataModel

 } from '../../../application/models/identificationProcessModels';



export default function identificationProcessRedisRepository() {

    if (!redisConnection.connection)
        redisConnection.connect();
    const redisClient = redisConnection.connection;


    async function setRFID(data: RFIDCacheDataModel): Promise<void> {
        try {

            await redisClient.hSet(`RFID_${data.pureData.GateId}`, 'data', JSON.stringify(data));

            var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
            console.info(`RFIDTag in Redis Updated! ${dateFormat}`);

        } catch (error) {
            console.error(`Error updating RFID data In Redis: ${error}`);
        }
    }


    async function getRFID(gateId:string): Promise<RFIDCacheDataModel | null> {
        try {
            const value = await redisClient.get('RFID');
            const data: RFIDCacheDataModel = JSON.parse(value);

            return data;
        } catch (error) {
            console.error(`Error getting RFID data: ${error}`);
            return null;
        }
    }


    async function setHF(data: HFCacheDataModel): Promise<void> {
        try {

            await redisClient.hSet(`RFID_${data.pureData.gateId}`, 'data', JSON.stringify(data));

            var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
            console.info(`HFCard in Redis Updated! ${dateFormat}`);

        } catch (error) {
            console.error(`Error updating HF data In Redis: ${error}`);
        }
    }


    async function getHF(gateId:string): Promise<HFCacheDataModel | null> {
        try {
            const value = await redisClient.get('HF');
            const data: HFCacheDataModel = JSON.parse(value);

            return data;
        } catch (error) {
            console.error(`Error getting HF data: ${error}`);
            return null;
        }
    }



    return {
        setRFID,
        getRFID,

        setHF,
        getHF


    }

}