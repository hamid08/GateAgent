import { TagDataModel, ANPRDataModel, SmartGateModel } from '../models/smartGateModels';
import { SocketModel } from '../models/gateSettingModels';
import mongoRepository from '../../frameworks/database/mongoDB/repositories/gateRepository';
import gateSettingRepository from '../../frameworks/database/mongoDB/repositories/gateSettingRepository';
// import socketConnection from '../../frameworks/services/socket/connection';

import redisRepository from '../../frameworks/database/redis/gateRepository';

export default function socketService() {
    const _mongoRepository = mongoRepository();
    const _redisRepository = redisRepository();



    const getSocketConnectInfoByToken = async function (token: string): Promise<SocketModel | null> {

        return await gateSettingRepository().getSocketConnectInfoByToken(token);
    }

    const findGateServiceToGateSettingByToken = async (token: string): Promise<boolean> => {

        return await gateSettingRepository().findGateServiceToGateSettingByToken(token);
    }

    // const getGateSetting = async (gateId: string): Promise<SmartGateModel> => {
    //     return await _mongoRepository.getSmartGateProccessInfoById(gateId);
    // }


    const proccesRFIDTag = async function (tagData: TagDataModel) {

        await _redisRepository.setRFID(tagData);


        // Step 1 => Find Vehicle By Vehicle List Or TrafficGroupList
        var vehicle = await _mongoRepository.findVehicleByTag(tagData.Tag);
        if (vehicle == null) {
            console.log(`Vehicle By Tag:${tagData.Tag} Not Found!`);
        }

        // await socketConnection().sendToScreen('RFIDTag', vehicle,tagData.GateId);

        // Step 2 => Find Gate And Read GateSetting



    }


    const proccesANPRPlate = async function (plateData: ANPRDataModel) {

        // Step 1 => Find Vehicle By Vehicle List Or TrafficGroupList
        var vehicle = await _mongoRepository.findVehicleByPlate(plateData.Plate);
        if (vehicle == null) {
            console.log(`Vehicle By Plate:${plateData.Plate} Not Found!`);
        }

        // await socketConnection().sendToScreen('RFIDTag', vehicle,plateData.GateId);



        // Step 2 => Find Gate And Read GateSetting



    }


    return {
        proccesRFIDTag,
        proccesANPRPlate,
        getSocketConnectInfoByToken,
        findGateServiceToGateSettingByToken
    }
}