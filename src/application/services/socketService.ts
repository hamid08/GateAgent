import { TagDataModel, ANPRDataModel, HFDataModel } from '../models/smartGateModels';
import { SocketModel } from '../models/gateSettingModels';
import mongoRepository from '../../frameworks/database/mongoDB/repositories/gateRepository';
import gateSettingRepository from '../../frameworks/database/mongoDB/repositories/gateSettingRepository';

import {
    getSocketIo

} from '../../frameworks/services/socket/connection';


import identificationProcessService from './identificationProcessService';

import {
    RFIDCacheDataModel,
    RFIDDetectedDataModel,
    RFIDPureDataModel,
    RFIDDataSocketModel,

    HFDetectedDataModel,
    HFPureDataModel,
    HFCacheDataModel,
    HFDataSocketModel,

    ANPRCacheDataModel,
    ANPRDataSocketModel,
    ANPRDetectedDataModel,
    ANPRPureDataModel


} from '../models/identificationProcessModels';

import identificationProcessRedisRepository from '../../frameworks/database/redis/identificationProcessRedisRepository';
import { IdentificationProcessTrafficType, SmartGatePriority } from '../enums/gateEnum';

export default function socketService() {
    const _mongoRepository = mongoRepository();
    const _redisRepository = identificationProcessRedisRepository();
    const io = getSocketIo();


    const getSocketConnectInfoByToken = async function (token: string): Promise<SocketModel | null> {

        return await gateSettingRepository().getSocketConnectInfoByToken(token);
    }

    const findGateServiceToGateSettingByToken = async (token: string): Promise<boolean> => {

        return await gateSettingRepository().findGateServiceToGateSettingByToken(token);
    }

    const checkIsRunProcessOrTemporaryLockProcess = async function (gateId:string): Promise<boolean> {

        return await identificationProcessService().isRunProcess() || await _redisRepository.existTemporaryLockProcess(gateId);
    }

    const proccesRFIDTag = async function (tagData: TagDataModel) {

        var gateId = tagData.GateId;

        if (await checkIsRunProcessOrTemporaryLockProcess(gateId)) return;


        //Create Pure Tage Data Model For Redis
        var rfidRedisData: RFIDCacheDataModel = new RFIDCacheDataModel(
            new RFIDPureDataModel(tagData.Tag, tagData.RFIDAntennaId, gateId, tagData.DateTime),
            false,
            undefined

        );


        // Check For Detect Target By This Data

        // Get Gate Setting
        var gateSetting = await _mongoRepository.getSmartGateProccessInfoById(gateId);

        if (!gateSetting && gateSetting == null) {
            console.warn(`In ProcessRFIDTag Stop Process Because Not Found GateSetting!`);
            return;
        }


        // Find Priority For Search
        if (gateSetting.taxiWorkMode && gateSetting.taxiWorkModeInfo && gateSetting.taxiWorkModeInfo.priority == SmartGatePriority.First) {

            var vehicle = await _mongoRepository.findInTaxiListByTag(tagData.Tag);

            if (!vehicle || vehicle == null) { // Not Found In Taxi List

                console.info(`In ProcessRFIDTag Not Found In Taxi List!`);


                if (gateSetting.trafficControlWorkMode) {
                    var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByTag(tagData.Tag);

                    if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                        await io.to(gateId).emit("RFIDData", new RFIDDataSocketModel(gateId, false));
                        console.info(`In ProcessRFIDTag Not Found In TrafficControl List & Taxi List!`);
                        await _redisRepository.setRFID(rfidRedisData);

                    }
                    else { // Found In TrafficControl List

                        rfidRedisData.detected = true;
                        rfidRedisData.detectedData = new RFIDDetectedDataModel(
                            IdentificationProcessTrafficType.TrafficControl,
                            permissionTrafficGroup.plaqueNo,
                            permissionTrafficGroup.plaqueType,
                            permissionTrafficGroup.id,
                            permissionTrafficGroup.name
                        );


                        await _redisRepository.setRFID(rfidRedisData);

                        await io.to(gateId).emit("RFIDData", new RFIDDataSocketModel(
                            gateId,
                            true,
                            permissionTrafficGroup.name,
                            '',
                            permissionTrafficGroup.plaqueNo,
                            permissionTrafficGroup.plaqueType,

                        ));

                        console.info(`In ProcessRFIDTag Found In TrafficControl List!`);



                    }
                }
                else {
                    await io.to(gateId).emit("RFIDData", new RFIDDataSocketModel(gateId, false));
                    console.info(`In ProcessRFIDTag Not Found In TrafficControl List & Taxi List!`);
                    await _redisRepository.setRFID(rfidRedisData);

                }


            }

            else { // Found In Taxi List

                rfidRedisData.detected = true;
                rfidRedisData.detectedData = new RFIDDetectedDataModel(
                    IdentificationProcessTrafficType.Taxi,
                    vehicle.plaqueNo,
                    vehicle.plaqueType,
                    '',
                    '',
                    vehicle.id,
                    vehicle.identity,
                    vehicle.vehicleUserTypeCaption
                );

                await _redisRepository.setRFID(rfidRedisData);

                await io.to(gateId).emit("RFIDData", new RFIDDataSocketModel(
                    gateId,
                    true,
                    '',
                    vehicle.identity,
                    vehicle.plaqueNo,
                    vehicle.plaqueType,

                ));

                console.info(`In ProcessRFIDTag Found In Taxi List!`);



            }


        }

        else if (gateSetting.trafficControlWorkMode && gateSetting.trafficControlWorkModeInfo && gateSetting.trafficControlWorkModeInfo.priority == SmartGatePriority.First) {

            var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByTag(tagData.Tag);


            if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                console.info(`In ProcessRFIDTag Not Found In TrafficControl List!`);

                if (gateSetting.taxiWorkMode) {
                    var vehicle = await _mongoRepository.findInTaxiListByTag(tagData.Tag);


                    if (!vehicle || vehicle == null) { // Not Found In Taxi List

                        await io.to(gateId).emit("RFIDData", new RFIDDataSocketModel(gateId, false));
                        console.info(`In ProcessRFIDTag Not Found In TrafficControl List & Taxi List!`);
                        await _redisRepository.setRFID(rfidRedisData);


                    }
                    else { // Found In Taxi List

                        rfidRedisData.detected = true;
                        rfidRedisData.detectedData = new RFIDDetectedDataModel(
                            IdentificationProcessTrafficType.Taxi,
                            vehicle.plaqueNo,
                            vehicle.plaqueType,
                            '',
                            '',
                            vehicle.id,
                            vehicle.identity,
                            vehicle.vehicleUserTypeCaption
                        );

                        await _redisRepository.setRFID(rfidRedisData);

                        await io.to(gateId).emit("RFIDData", new RFIDDataSocketModel(
                            gateId,
                            true,
                            '',
                            vehicle.identity,
                            vehicle.plaqueNo,
                            vehicle.plaqueType,

                        ));

                        console.info(`In ProcessRFIDTag Found In Taxi List!`);

                    }
                }
                else {
                    await io.to(gateId).emit("RFIDData", new RFIDDataSocketModel(gateId, false));
                    console.info(`In ProcessRFIDTag Not Found In TrafficControl List & Taxi List!`);
                    await _redisRepository.setRFID(rfidRedisData);

                }


            }

            else { //  Found In TrafficControl List


                rfidRedisData.detected = true;
                rfidRedisData.detectedData = new RFIDDetectedDataModel(
                    IdentificationProcessTrafficType.TrafficControl,
                    permissionTrafficGroup.plaqueNo,
                    permissionTrafficGroup.plaqueType,
                    permissionTrafficGroup.id,
                    permissionTrafficGroup.name
                );

                await _redisRepository.setRFID(rfidRedisData);


                await io.to(gateId).emit("RFIDData", new RFIDDataSocketModel(
                    gateId,
                    true,
                    permissionTrafficGroup.name,
                    '',
                    permissionTrafficGroup.plaqueNo,
                    permissionTrafficGroup.plaqueType,

                ));

                console.info(`In ProcessRFIDTag Found In TrafficControl List!`);

            }


        }

    }


    const proccesHFCard = async function (cardData: HFDataModel) {

        var gateId = cardData.gateId;

        if (await checkIsRunProcessOrTemporaryLockProcess(gateId)) return;

        //Create Pure Tage Data Model For Redis
        var hfRedisData: HFCacheDataModel = new HFCacheDataModel(
            new HFPureDataModel(cardData.cardNo, gateId, cardData.dateTime),
            false,
            undefined

        );


        // Check For Detect Target By This Data

        // Get Gate Setting
        var gateSetting = await _mongoRepository.getSmartGateProccessInfoById(gateId);

        if (!gateSetting && gateSetting == null) {
            console.warn(`In ProcessHFCard Stop Process Because Not Found GateSetting!`);
            return;
        }


        // Find Priority For Search
        if (gateSetting.taxiWorkMode && gateSetting.taxiWorkModeInfo && gateSetting.taxiWorkModeInfo.priority == SmartGatePriority.First) {

            var driver = await _mongoRepository.findInTaxiListByCardNo(cardData.cardNo);

            if (!driver || driver == null) { // Not Found In Taxi List

                console.info(`In ProcessHFCard Not Found In Taxi List!`);


                if (gateSetting.trafficControlWorkMode) {
                    var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByCardNo(cardData.cardNo);

                    if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                        await io.to(gateId).emit("HFData", new HFDataSocketModel(gateId, false));
                        console.info(`In ProcessHFCard Not Found In TrafficControl List & Taxi List!`);
                        await _redisRepository.setHF(hfRedisData);

                    }
                    else { // Found In TrafficControl List

                        hfRedisData.detected = true;
                        hfRedisData.detectedData = new HFDetectedDataModel(
                            IdentificationProcessTrafficType.TrafficControl,
                            permissionTrafficGroup.id,
                            permissionTrafficGroup.name
                        );


                        await _redisRepository.setHF(hfRedisData);

                        await io.to(gateId).emit("HFData", new HFDataSocketModel(
                            gateId,
                            true,
                            permissionTrafficGroup.name,
                        ));

                        console.info(`In ProcessHFCard Found In TrafficControl List!`);
                    }
                }
                else {
                    await io.to(gateId).emit("HFData", new HFDataSocketModel(gateId, false));
                    console.info(`In ProcessHFCard Not Found In TrafficControl List & Taxi List!`);
                    await _redisRepository.setHF(hfRedisData);

                }


            }

            else { // Found In Taxi List

                hfRedisData.detected = true;
                hfRedisData.detectedData = new HFDetectedDataModel(
                    IdentificationProcessTrafficType.Taxi,
                    '', // permissionTrafficGroupId By This Type Default Is Empty
                    '', // Name BY This Type Default Is Empty
                    '1', //TODO Set DriverId
                    '', // TODO Set NationalNo
                    'محمد رضا احدی',
                    '', // TODO Set Driver Avatar

                );

                await _redisRepository.setHF(hfRedisData);

                await io.to(gateId).emit("HFData", new HFDataSocketModel(
                    gateId,
                    true,
                    'محمد رضا احدی',
                    '', // TODO Set Driver Avatar

                ));

                console.info(`In ProcessHFCard Found In Taxi List!`);



            }


        }

        else if (gateSetting.trafficControlWorkMode && gateSetting.trafficControlWorkModeInfo && gateSetting.trafficControlWorkModeInfo.priority == SmartGatePriority.First) {

            var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByCardNo(cardData.cardNo);


            if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                console.info(`In ProcessHFCard Not Found In TrafficControl List!`);

                if (gateSetting.taxiWorkMode) {

                    var driver = await _mongoRepository.findInTaxiListByCardNo(cardData.cardNo);


                    if (!driver || driver == null) { // Not Found In Taxi List

                        await io.to(gateId).emit("HFData", new HFDataSocketModel(gateId, false));
                        console.info(`In ProcessHFCard Not Found In TrafficControl List & Taxi List!`);
                        await _redisRepository.setHF(hfRedisData);


                    }
                    else { // Found In Taxi List

                        hfRedisData.detected = true;
                        hfRedisData.detectedData = new HFDetectedDataModel(
                            IdentificationProcessTrafficType.Taxi,
                            '', // permissionTrafficGroupId By This Type Default Is Empty
                            '', // Name BY This Type Default Is Empty
                            '1', //TODO Set DriverId
                            '', // TODO Set NationalNo
                            'محمد رضا احدی',
                            '', // TODO Set Driver Avatar

                        );

                        await _redisRepository.setHF(hfRedisData);

                        await io.to(gateId).emit("HFData", new HFDataSocketModel(
                            gateId,
                            true,
                            'محمد رضا احدی',
                            '', // TODO Set Driver Avatar

                        ));

                        console.info(`In ProcessHFCard Found In Taxi List!`);

                    }
                }
                else {
                    await io.to(gateId).emit("HFData", new HFDataSocketModel(gateId, false));
                    console.info(`In ProcessHFCard Not Found In TrafficControl List & Taxi List!`);
                    await _redisRepository.setHF(hfRedisData);

                }


            }

            else { // Found In TrafficControl List


                hfRedisData.detected = true;
                hfRedisData.detectedData = new HFDetectedDataModel(
                    IdentificationProcessTrafficType.TrafficControl,
                    permissionTrafficGroup.id,
                    permissionTrafficGroup.name
                );


                await _redisRepository.setHF(hfRedisData);

                await io.to(gateId).emit("HFData", new HFDataSocketModel(
                    gateId,
                    true,
                    permissionTrafficGroup.name,
                ));

                console.info(`In ProcessHFCard Found In TrafficControl List!`);

            }


        }

    }



    const proccesANPRPlate = async function (plateData: ANPRDataModel) {

        var gateId = plateData.GateId;

        if (await checkIsRunProcessOrTemporaryLockProcess(gateId)) return;


        //Create Pure Tage Data Model For Redis
        var anprRedisData: ANPRCacheDataModel = new ANPRCacheDataModel(
            new ANPRPureDataModel(plateData.Plate, plateData.CameraId, gateId, plateData.DateTime),
            false,
            undefined

        );


        // Check For Detect Target By This Data

        // Get Gate Setting
        var gateSetting = await _mongoRepository.getSmartGateProccessInfoById(gateId);

        if (!gateSetting && gateSetting == null) {
            console.warn(`In ProcessANPRPlate Stop Process Because Not Found GateSetting!`);
            return;
        }


        // Find Priority For Search
        if (gateSetting.taxiWorkMode && gateSetting.taxiWorkModeInfo && gateSetting.taxiWorkModeInfo.priority == SmartGatePriority.First) {

            var vehicle = await _mongoRepository.findInTaxiListByPlaqueNo(plateData.Plate);

            if (!vehicle || vehicle == null) { // Not Found In Taxi List

                console.info(`In ProcessANPRPlate Not Found In Taxi List!`);


                if (gateSetting.trafficControlWorkMode) {
                    var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByPlaqueNo(plateData.Plate);

                    if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                        await io.to(gateId).emit("ANPRData", new ANPRDataSocketModel(gateId, false, plateData.DateTime, plateData.image));
                        console.info(`In ProcessANPRPlate Not Found In TrafficControl List & Taxi List!`);
                        await _redisRepository.setANPR(anprRedisData);

                    }
                    else { // Found In TrafficControl List

                        anprRedisData.detected = true;
                        anprRedisData.detectedData = new ANPRDetectedDataModel(
                            IdentificationProcessTrafficType.TrafficControl,
                            permissionTrafficGroup.plaqueNo,
                            permissionTrafficGroup.plaqueType,
                            permissionTrafficGroup.id,
                            permissionTrafficGroup.name
                        );


                        await _redisRepository.setANPR(anprRedisData);

                        await io.to(gateId).emit("ANPRData", new ANPRDataSocketModel(
                            gateId,
                            true,
                            plateData.DateTime,
                            plateData.image,
                            permissionTrafficGroup.name,
                            '',
                            permissionTrafficGroup.plaqueNo,
                            permissionTrafficGroup.plaqueType,

                        ));

                        console.info(`In ProcessANPRPlate Found In TrafficControl List!`);



                    }
                }
                else {
                    await io.to(gateId).emit("ANPRData", new ANPRDataSocketModel(gateId, false, plateData.DateTime, plateData.image));
                    console.info(`In ProcessANPRPlate Not Found In TrafficControl List & Taxi List!`);
                    await _redisRepository.setANPR(anprRedisData);

                }


            }

            else { // Found In Taxi List

                anprRedisData.detected = true;
                anprRedisData.detectedData = new ANPRDetectedDataModel(
                    IdentificationProcessTrafficType.Taxi,
                    vehicle.plaqueNo,
                    vehicle.plaqueType,
                    '',
                    '',
                    vehicle.id,
                    vehicle.identity,
                    vehicle.vehicleUserTypeCaption
                );

                await _redisRepository.setANPR(anprRedisData);

                await io.to(gateId).emit("ANPRData", new ANPRDataSocketModel(
                    gateId,
                    true,
                    plateData.DateTime,
                    plateData.image,
                    '',
                    vehicle.identity,
                    vehicle.plaqueNo,
                    vehicle.plaqueType,

                ));

                console.info(`In ProcessANPRPlate Found In Taxi List!`);



            }


        }

        else if (gateSetting.trafficControlWorkMode && gateSetting.trafficControlWorkModeInfo && gateSetting.trafficControlWorkModeInfo.priority == SmartGatePriority.First) {

            var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByPlaqueNo(plateData.Plate);


            if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                console.info(`In ProcessRFIDTag Not Found In TrafficControl List!`);

                if (gateSetting.taxiWorkMode) {
                    var vehicle = await _mongoRepository.findInTaxiListByPlaqueNo(plateData.Plate);


                    if (!vehicle || vehicle == null) { // Not Found In Taxi List

                        await io.to(gateId).emit("ANPRData", new ANPRDataSocketModel(gateId, false, plateData.DateTime, plateData.image));
                        console.info(`In ProcessANPRPlate Not Found In TrafficControl List & Taxi List!`);
                        await _redisRepository.setANPR(anprRedisData);


                    }
                    else { // Found In Taxi List

                        anprRedisData.detected = true;
                        anprRedisData.detectedData = new ANPRDetectedDataModel(
                            IdentificationProcessTrafficType.Taxi,
                            vehicle.plaqueNo,
                            vehicle.plaqueType,
                            '',
                            '',
                            vehicle.id,
                            vehicle.identity,
                            vehicle.vehicleUserTypeCaption
                        );
        
                        await _redisRepository.setANPR(anprRedisData);
        
                        await io.to(gateId).emit("ANPRData", new ANPRDataSocketModel(
                            gateId,
                            true,
                            plateData.DateTime,
                            plateData.image,
                            '',
                            vehicle.identity,
                            vehicle.plaqueNo,
                            vehicle.plaqueType,
        
                        ));
        
                        console.info(`In ProcessANPRPlate Found In Taxi List!`);

                    }
                }
                else {
                    await io.to(gateId).emit("ANPRData", new ANPRDataSocketModel(gateId, false, plateData.DateTime, plateData.image));
                    console.info(`In ProcessANPRPlate Not Found In TrafficControl List & Taxi List!`);
                    await _redisRepository.setANPR(anprRedisData);

                }


            }

            else { //  Found In TrafficControl List


                anprRedisData.detected = true;
                anprRedisData.detectedData = new ANPRDetectedDataModel(
                    IdentificationProcessTrafficType.TrafficControl,
                    permissionTrafficGroup.plaqueNo,
                    permissionTrafficGroup.plaqueType,
                    permissionTrafficGroup.id,
                    permissionTrafficGroup.name
                );


                await _redisRepository.setANPR(anprRedisData);

                await io.to(gateId).emit("ANPRData", new ANPRDataSocketModel(
                    gateId,
                    true,
                    plateData.DateTime,
                    plateData.image,
                    permissionTrafficGroup.name,
                    '',
                    permissionTrafficGroup.plaqueNo,
                    permissionTrafficGroup.plaqueType,

                ));

                console.info(`In ProcessANPRPlate Found In TrafficControl List!`);

            }


        }

    }


    return {
        proccesRFIDTag,
        proccesANPRPlate,
        getSocketConnectInfoByToken,
        findGateServiceToGateSettingByToken,
        proccesHFCard
    }
}