import redisConnection from "./connection";
import moment from 'moment';
import {

    RFIDCacheDataModel,
    HFCacheDataModel,
    ANPRCacheDataModel

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


    async function getRFID(gateId: string): Promise<RFIDCacheDataModel | null> {
        try {
            const value: any = await redisClient.hGet(`RFID_${gateId}`, 'data');

            if (!value) {
                throw new Error(`No RFID data found for gateId ${gateId}`);
            }

            return JSON.parse(value);
        } catch (error) {
            console.error(`Error getting RFID data in redis: ${error}`);
            return null;
        }
    }


    async function delRFID(gateId: string): Promise<void> {
        try {
            await redisClient.hDel(`RFID_${gateId}`, 'data');
        } catch (error) {
            console.error(`Error delete RFID data in redis: ${error}`);
        }
    }


    async function setHF(data: HFCacheDataModel): Promise<void> {
        try {

            await redisClient.hSet(`HF_${data.pureData.gateId}`, 'data', JSON.stringify(data));

            var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
            console.info(`HFCard in Redis Updated! ${dateFormat}`);

        } catch (error) {
            console.error(`Error updating HF data In Redis: ${error}`);
        }
    }


    async function getHF(gateId: string): Promise<HFCacheDataModel | null> {
        try {
            const value: any = await redisClient.hGet(`HF_${gateId}`, 'data');

            if (!value) {
                throw new Error(`No HF data found for gateId ${gateId}`);
            }

            return JSON.parse(value);
        } catch (error) {
            console.error(`Error getting HF data in redis: ${error}`);
            return null;
        }
    }

    async function delHF(gateId: string): Promise<void> {
        try {
            await redisClient.hDel(`HF_${gateId}`, 'data');
        } catch (error) {
            console.error(`Error delete HF data in redis: ${error}`);
        }
    }



    async function setANPR(data: ANPRCacheDataModel): Promise<void> {
        try {

            await redisClient.hSet(`ANPR_${data.pureData.GateId}`, 'data', JSON.stringify(data));

            var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
            console.info(`ANPRPlate in Redis Updated! ${dateFormat}`);

        } catch (error) {
            console.error(`Error updating ANPR data In Redis: ${error}`);
        }
    }


    async function getANPR(gateId: string): Promise<ANPRCacheDataModel | null> {
        try {
            const value: any = await redisClient.hGet(`ANPR_${gateId}`, 'data');

            if (!value) {
                throw new Error(`No ANPR data found for gateId ${gateId}`);
            }

            return JSON.parse(value);
        } catch (error) {
            console.error(`Error getting ANPR data: ${error}`);
            return null;
        }
    }

    async function delANPR(gateId: string): Promise<void> {
        try {
            await redisClient.hDel(`ANPR_${gateId}`, 'data');
        } catch (error) {
            console.error(`Error delete ANPR data In Redis: ${error}`);
        }
    }


    async function setTemporaryLockProcess(gateId: string): Promise<void> {
        try {

            await redisClient.hSet(`TemporaryLockProcess_${gateId}`, 'data', 'TemporaryLockProcess');
            await redisClient.expire(`TemporaryLockProcess_${gateId}`, 10);


            var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
            console.info(`TemporaryLockProcess in Redis Updated! ${dateFormat}`);

        } catch (error) {
            console.error(`Error updating TemporaryLockProcess data In Redis: ${error}`);
        }
    }


    async function existTemporaryLockProcess(gateId: string): Promise<boolean> {
        try {
            const value: any = await redisClient.hGet(`TemporaryLockProcess_${gateId}`, 'data');
            if (value) return true;

            return false;
        } catch (error) {
            console.error(`Error getting TemporaryLockProcess data: ${error}`);
            return false;
        }
    }



    return {
        setRFID,
        getRFID,

        setHF,
        getHF,

        setANPR,
        getANPR,

        existTemporaryLockProcess,
        setTemporaryLockProcess,

        delANPR,
        delHF,
        delRFID

    }

}