import { TagDataModel, ANPRDataModel, HFDataModel, SmartGateModel } from '../models/smartGateModels';
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
    ANPRPureDataModel,
    IdentificationProcessModel


} from '../models/identificationProcessModels';


import {
    IOperator_IdentityResultBox_Model,
    IOperator_IdentityResultBoxInfo_Model

} from '../models/operatorModels';

import identificationProcessRedisRepository from '../../frameworks/database/redis/identificationProcessRedisRepository';
import { AcceptanceType, IdentificationProcessStatus, IdentificationProcessTrafficType, IdentityMessageType, IdentityResultType, SmartGatePriority, SmartGateType, VehiclePlaqueType } from '../enums/gateEnum';

import config from '../../config/config';


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

    const checkIsRunProcessOrTemporaryLockProcess = async function (gateId: string): Promise<boolean> {

        return await identificationProcessService().checkRuningProcessInGate(gateId) || await _redisRepository.existTemporaryLockProcess(gateId);
    }

    const processRFIDTag = async function (tagData: TagDataModel) {

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

                        await io.to(gateId).emit(config.socket.rfidDataSocket, new RFIDDataSocketModel(gateId, false));
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

                        await io.to(gateId).emit(config.socket.rfidDataSocket, new RFIDDataSocketModel(
                            gateId,
                            true,
                            permissionTrafficGroup.name,
                            '',
                            permissionTrafficGroup.plaqueNo,
                            permissionTrafficGroup.plaqueType,

                        ));

                        console.info(`In ProcessRFIDTag Found In TrafficControl List!`);

                        //#region Check Detection
                        await checkDetection(gateId, gateSetting);
                        //#endregion

                    }
                }
                else {
                    await io.to(gateId).emit(config.socket.rfidDataSocket, new RFIDDataSocketModel(gateId, false));
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

                await io.to(gateId).emit(config.socket.rfidDataSocket, new RFIDDataSocketModel(
                    gateId,
                    true,
                    '',
                    vehicle.identity,
                    vehicle.plaqueNo,
                    vehicle.plaqueType,

                ));

                console.info(`In ProcessRFIDTag Found In Taxi List!`);

                //#region Check Detection
                await checkDetection(gateId, gateSetting);
                //#endregion


            }


        }

        else if (gateSetting.trafficControlWorkMode && gateSetting.trafficControlWorkModeInfo && gateSetting.trafficControlWorkModeInfo.priority == SmartGatePriority.First) {

            var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByTag(tagData.Tag);


            if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                console.info(`In ProcessRFIDTag Not Found In TrafficControl List!`);

                if (gateSetting.taxiWorkMode) {
                    var vehicle = await _mongoRepository.findInTaxiListByTag(tagData.Tag);


                    if (!vehicle || vehicle == null) { // Not Found In Taxi List

                        await io.to(gateId).emit(config.socket.rfidDataSocket, new RFIDDataSocketModel(gateId, false));
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

                        await io.to(gateId).emit(config.socket.rfidDataSocket, new RFIDDataSocketModel(
                            gateId,
                            true,
                            '',
                            vehicle.identity,
                            vehicle.plaqueNo,
                            vehicle.plaqueType,

                        ));

                        console.info(`In ProcessRFIDTag Found In Taxi List!`);

                        //#region Check Detection
                        await checkDetection(gateId, gateSetting);
                        //#endregion

                    }
                }
                else {
                    await io.to(gateId).emit(config.socket.rfidDataSocket, new RFIDDataSocketModel(gateId, false));
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


                await io.to(gateId).emit(config.socket.rfidDataSocket, new RFIDDataSocketModel(
                    gateId,
                    true,
                    permissionTrafficGroup.name,
                    '',
                    permissionTrafficGroup.plaqueNo,
                    permissionTrafficGroup.plaqueType,

                ));

                console.info(`In ProcessRFIDTag Found In TrafficControl List!`);

                //#region Check Detection
                await checkDetection(gateId, gateSetting);
                //#endregion

            }


        }

    }



    const processANPRPlate = async function (plateData: ANPRDataModel) {

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

                        await io.to(gateId).emit(config.socket.anprDataSocket, new ANPRDataSocketModel(gateId, false, plateData.DateTime, plateData.image));
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

                        await io.to(gateId).emit(config.socket.anprDataSocket, new ANPRDataSocketModel(
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


                        //#region Check Detection
                        await checkDetection(gateId, gateSetting);
                        //#endregion

                    }
                }
                else {
                    await io.to(gateId).emit(config.socket.anprDataSocket, new ANPRDataSocketModel(gateId, false, plateData.DateTime, plateData.image));
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

                await io.to(gateId).emit(config.socket.anprDataSocket, new ANPRDataSocketModel(
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

                //#region Check Detection
                await checkDetection(gateId, gateSetting);
                //#endregion


            }


        }

        else if (gateSetting.trafficControlWorkMode && gateSetting.trafficControlWorkModeInfo && gateSetting.trafficControlWorkModeInfo.priority == SmartGatePriority.First) {

            var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByPlaqueNo(plateData.Plate);


            if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                console.info(`In ProcessRFIDTag Not Found In TrafficControl List!`);

                if (gateSetting.taxiWorkMode) {
                    var vehicle = await _mongoRepository.findInTaxiListByPlaqueNo(plateData.Plate);


                    if (!vehicle || vehicle == null) { // Not Found In Taxi List

                        await io.to(gateId).emit(config.socket.anprDataSocket, new ANPRDataSocketModel(gateId, false, plateData.DateTime, plateData.image));
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

                        await io.to(gateId).emit(config.socket.anprDataSocket, new ANPRDataSocketModel(
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

                        //#region Check Detection
                        await checkDetection(gateId, gateSetting);
                        //#endregion

                    }
                }
                else {
                    await io.to(gateId).emit(config.socket.anprDataSocket, new ANPRDataSocketModel(gateId, false, plateData.DateTime, plateData.image));
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

                await io.to(gateId).emit(config.socket.anprDataSocket, new ANPRDataSocketModel(
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

                //#region Check Detection
                await checkDetection(gateId, gateSetting);
                //#endregion


            }


        }

    }

    const processHFCard = async function (cardData: HFDataModel) {
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

                        await io.to(gateId).emit(config.socket.hfDataSocket, new HFDataSocketModel(gateId, false));
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

                        await io.to(gateId).emit(config.socket.hfDataSocket, new HFDataSocketModel(
                            gateId,
                            true,
                            permissionTrafficGroup.name,
                        ));

                        console.info(`In ProcessHFCard Found In TrafficControl List!`);

                        //#region Check Detection
                        await checkDetection(gateId, gateSetting);
                        //#endregion

                    }
                }
                else {
                    await io.to(gateId).emit(config.socket.hfDataSocket, new HFDataSocketModel(gateId, false));
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
                    config.socket.driverAvatar64, // TODO Set Driver Avatar

                );

                await _redisRepository.setHF(hfRedisData);

                await io.to(gateId).emit(config.socket.hfDataSocket, new HFDataSocketModel(
                    gateId,
                    true,
                    'محمد رضا احدی',
                    '', // TODO Set Driver Avatar

                ));

                console.info(`In ProcessHFCard Found In Taxi List!`);

                //#region Check Detection
                await checkDetection(gateId, gateSetting);
                //#endregion



            }


        }

        else if (gateSetting.trafficControlWorkMode && gateSetting.trafficControlWorkModeInfo && gateSetting.trafficControlWorkModeInfo.priority == SmartGatePriority.First) {

            var permissionTrafficGroup = await _mongoRepository.findInTrafficControlListByCardNo(cardData.cardNo);


            if (!permissionTrafficGroup || permissionTrafficGroup == null) { // Not Found In TrafficControl List

                console.info(`In ProcessHFCard Not Found In TrafficControl List!`);

                if (gateSetting.taxiWorkMode) {

                    var driver = await _mongoRepository.findInTaxiListByCardNo(cardData.cardNo);


                    if (!driver || driver == null) { // Not Found In Taxi List

                        await io.to(gateId).emit(config.socket.hfDataSocket, new HFDataSocketModel(gateId, false));
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
                            config.socket.driverAvatar64, // TODO Set Driver Avatar

                        );

                        await _redisRepository.setHF(hfRedisData);

                        await io.to(gateId).emit(config.socket.hfDataSocket, new HFDataSocketModel(
                            gateId,
                            true,
                            'محمد رضا احدی',
                            '', // TODO Set Driver Avatar

                        ));

                        console.info(`In ProcessHFCard Found In Taxi List!`);

                        //#region Check Detection
                        await checkDetection(gateId, gateSetting);
                        //#endregion


                    }
                }
                else {
                    await io.to(gateId).emit(config.socket.hfDataSocket, new HFDataSocketModel(gateId, false));
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

                await io.to(gateId).emit(config.socket.hfDataSocket, new HFDataSocketModel(
                    gateId,
                    true,
                    permissionTrafficGroup.name,
                ));

                console.info(`In ProcessHFCard Found In TrafficControl List!`);

                //#region Check Detection
                await checkDetection(gateId, gateSetting);
                //#endregion


            }


        }

    }

    const checkDetection = async function (gateId: string, gateSetting: SmartGateModel) {


        // Check Gate Type
        if (gateSetting.gateType != SmartGateType.CheckPoint) {
            console.warn(`CheckDetection Failed Because GateType Not Equal CheckPoint!`);
            return;
        }


        //Start Check Listener Data Into Redis

        // HFDataRedis
        var hfRedisData = await _redisRepository.getHF(gateId);

        // RFIDDataRedis
        var rfidRedisData = await _redisRepository.getRFID(gateId);

        // ANPRDataRedis
        var anprRedisData = await _redisRepository.getANPR(gateId);


        //HFRedisDetected
        var hfRedisDetected: boolean = hfRedisData && hfRedisData.detected && hfRedisData.detectedData ? true : false;

        //RFIDRedisDetected
        var rfidRedisDetected: boolean = rfidRedisData && rfidRedisData.detected && rfidRedisData.detectedData ? true : false;

        //ANPRRedisDetected
        var anprRedisDetected: boolean = anprRedisData && anprRedisData.detected && anprRedisData.detectedData ? true : false;



        if (hfRedisDetected) { // Start By HF Detection Process

            if (hfRedisData!.detectedData!.trafficType == IdentificationProcessTrafficType.Taxi) { // Founded In Taxi List

                var taxiWorkModeInfo = gateSetting.taxiWorkModeInfo;

                if (taxiWorkModeInfo.acceptanceType == AcceptanceType.All) { // For This Check HumanDetect & VehicleDetect && Match Driver By Vehicle

                    //#region  Check HumanDetect
                    // ==========================> Human Is Detected

                    //#endregion


                    //#region  Check VehicleDetect

                    if (taxiWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                        // Check ANPR Detect In Redis
                        if (!anprRedisDetected) {


                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی پلاک خودرو توسط دوربین انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion


                            console.warn(`CheckDetection Failed Because Need To ANPRRedisData!`);
                            return;
                        }

                        // Check Detect RFID In Redis
                        if (!rfidRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی تگ رادیویی خودرو انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion


                            console.warn(`CheckDetection Failed Because Need To RFIDRedisData!`);
                            return;
                        }
                    }

                    else { // For This Check ANPR | RFID Is Detect

                        // Check ANPR OR RFID Detect In Redis
                        if (!anprRedisDetected && !rfidRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی تگ رادیویی  یا پلاک خودرو انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion

                            console.warn(`CheckDetection Failed Because Need To ANPRRedisData OR RFIDRedisData!`);
                            return;

                        }

                        if (!anprRedisDetected) anprRedisData = null;
                        if (!rfidRedisDetected) rfidRedisData = null;
                    }

                    //#endregion


                    //#region  Check Driver Is Match By Vehicle

                    //TODO Check Match Driver By Vehicle


                    //#endregion


                    //#region Create IdentificationProcess By Type Taxi

                    await createProcess(gateId, IdentificationProcessTrafficType.Taxi, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion


                }

                else { // For This Check HumanDetect | VehicleDetect

                    // In This State Because HF Detect And HumanDetect Is True And Pass


                    if (!anprRedisDetected) anprRedisData = null;
                    if (!rfidRedisDetected) rfidRedisData = null;

                    //#region Create IdentificationProcess By Type Taxi

                    await createProcess(gateId, IdentificationProcessTrafficType.Taxi, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion

                }

            }
            else { // Founded In TrafficControl List

                var trafficControlWorkModeInfo = gateSetting.trafficControlWorkModeInfo;

                if (trafficControlWorkModeInfo.acceptanceType == AcceptanceType.All) { // For This Check HumanDetect & VehicleDetect

                    //#region  Check HumanDetect
                    // ==========================> Human Is Detected

                    //#endregion


                    //#region  Check VehicleDetect

                    if (trafficControlWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                        // Check ANPR Detect In Redis
                        if (!anprRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی پلاک خودرو توسط دوربین انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion

                            console.warn(`CheckDetection Failed Because Need To ANPRRedisData!`);
                            return;

                        }

                        // Check Detect RFID In Redis
                        if (!rfidRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی تگ رادیویی خودرو انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion

                            console.warn(`CheckDetection Failed Because Need To RFIDRedisData!`);
                            return;
                        }
                    }

                    else { // For This Check ANPR | RFID Is Detect

                        // Check ANPR OR RFID Detect In Redis
                        if (!anprRedisDetected && !rfidRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی تگ رادیویی  یا پلاک خودرو انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion

                            console.warn(`CheckDetection Failed Because Need To ANPRRedisData OR RFIDRedisData!`);
                            return;

                        }


                        if (!anprRedisDetected) anprRedisData = null;
                        if (!rfidRedisDetected) rfidRedisData = null;
                    }

                    //#endregion


                    //#region Create IdentificationProcess By Type TrafficControl

                    await createProcess(gateId, IdentificationProcessTrafficType.TrafficControl, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion


                }

                else { // For This Check HumanDetect | VehicleDetect

                    // In This State Because HF Detect And HumanDetect Is True And Pass

                    if (!anprRedisDetected) anprRedisData = null;
                    if (!rfidRedisDetected) rfidRedisData = null;

                    //#region Create IdentificationProcess By Type TrafficControl

                    await createProcess(gateId, IdentificationProcessTrafficType.TrafficControl, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion
                }

            }



        }


        else if (rfidRedisDetected) { // Start By RFID Detection Process

            if (rfidRedisData!.detectedData!.trafficType == IdentificationProcessTrafficType.Taxi) { // Founded In Taxi List

                var taxiWorkModeInfo = gateSetting.taxiWorkModeInfo;

                if (taxiWorkModeInfo.acceptanceType == AcceptanceType.All) { // For This Check HumanDetect & VehicleDetect && Match Driver By Vehicle

                    //#region  Check HumanDetect
                    // Because HumanDetectTools Just Contains HF Not Check HumanAcceptanceType

                    // Check HF Detect In Redis
                    if (!hfRedisDetected) {

                        //#region  Send Message To IdentityResultBox
                        var message: IOperator_IdentityResultBox_Model = {
                            description: 'کارت شناسایی را در محل مناسب قرار دهید',
                            messageType: IdentityMessageType.InsertTheCard,
                            type: IdentityResultType.Info,
                        };

                        io.to(gateId).emit("IdentityResultBox", message);
                        //#endregion

                        console.warn(`CheckDetection Failed Because Need To HFRedisData!`);
                        return;

                    }

                    //#endregion


                    //#region  Check VehicleDetect

                    if (taxiWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                        // Check ANPR Detect In Redis
                        if (!anprRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی پلاک خودرو توسط دوربین انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion

                            console.warn(`CheckDetection Failed Because Need To ANPRRedisData!`);
                            return;

                        }

                        // Check Detect RFID In Redis
                        // ==========================> RFID Is Detected

                    }

                    else { // For This Check ANPR | RFID Is Detect

                        // Check ANPR OR RFID Detect In Redis
                        // ==========================> RFID Is Detect


                        if (!anprRedisDetected) anprRedisData = null;
                    }

                    //#endregion


                    //#region  Check Driver Is Match By Vehicle

                    //TODO Check Match Driver By Vehicle


                    //#endregion


                    //#region Create IdentificationProcess By Type Taxi

                    await createProcess(gateId, IdentificationProcessTrafficType.Taxi, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion


                }

                else { // For This Check HumanDetect | VehicleDetect

                    if (!hfRedisDetected) { // Human Not Detected

                        hfRedisData = null;

                        //#region  Check VehicleDetect

                        if (taxiWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                            // Check ANPR Detect In Redis
                            if (!anprRedisDetected) {

                                //#region  Send Message To IdentityResultBox
                                var message: IOperator_IdentityResultBox_Model = {
                                    description: 'شناسایی پلاک خودرو توسط دوربین انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                    messageType: IdentityMessageType.IdentificationIsIncomplete,
                                    type: IdentityResultType.Info,
                                };

                                io.to(gateId).emit("IdentityResultBox", message);
                                //#endregion

                                console.warn(`CheckDetection Failed Because Need To ANPRRedisData!`);
                                return;

                            }

                            // Check Detect RFID In Redis
                            // ==========================> RFID Is Detect

                        }

                        else { // For This Check ANPR | RFID Is Detect

                            // Check ANPR OR RFID Detect In Redis
                            // ==========================> RFID Is Detect


                            if (!anprRedisDetected) anprRedisData = null;
                        }

                        //#endregion

                    }

                    //#region Create IdentificationProcess By Type Taxi

                    await createProcess(gateId, IdentificationProcessTrafficType.Taxi, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion

                }

            }
            else { // Founded In TrafficControl List


                var trafficControlWorkModeInfo = gateSetting.trafficControlWorkModeInfo;

                if (trafficControlWorkModeInfo.acceptanceType == AcceptanceType.All) { // For This Check HumanDetect & VehicleDetect && Match Driver By Vehicle

                    //#region  Check HumanDetect
                    // Because HumanDetectTools Just Contains HF Not Check HumanAcceptanceType

                    // Check HF Detect In Redis
                    if (!hfRedisDetected) {

                        //#region  Send Message To IdentityResultBox
                        var message: IOperator_IdentityResultBox_Model = {
                            description: 'کارت شناسایی را در محل مناسب قرار دهید',
                            messageType: IdentityMessageType.InsertTheCard,
                            type: IdentityResultType.Info,
                        };

                        io.to(gateId).emit("IdentityResultBox", message);
                        //#endregion


                        console.warn(`CheckDetection Failed Because Need To HFRedisData!`);
                        return;

                    }

                    //#endregion


                    //#region  Check VehicleDetect

                    if (trafficControlWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                        // Check ANPR Detect In Redis
                        if (!anprRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی پلاک خودرو توسط دوربین انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion

                            console.warn(`CheckDetection Failed Because Need To ANPRRedisData!`);
                            return;

                        }

                        // Check Detect RFID In Redis
                        // ==========================> RFID Is Detected

                    }

                    else { // For This Check ANPR | RFID Is Detect

                        // Check ANPR OR RFID Detect In Redis
                        // ==========================> RFID Is Detect


                        if (!anprRedisDetected) anprRedisData = null;
                    }

                    //#endregion


                    //#region Create IdentificationProcess By Type TrafficControl

                    await createProcess(gateId, IdentificationProcessTrafficType.TrafficControl, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion


                }

                else { // For This Check HumanDetect | VehicleDetect

                    if (!hfRedisDetected) { // Human Not Detected

                        hfRedisData = null;

                        //#region  Check VehicleDetect

                        if (trafficControlWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                            // Check ANPR Detect In Redis
                            if (!anprRedisDetected) {

                                //#region  Send Message To IdentityResultBox
                                var message: IOperator_IdentityResultBox_Model = {
                                    description: 'شناسایی پلاک خودرو توسط دوربین انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                    messageType: IdentityMessageType.IdentificationIsIncomplete,
                                    type: IdentityResultType.Info,
                                };

                                io.to(gateId).emit("IdentityResultBox", message);
                                //#endregion


                                console.warn(`CheckDetection Failed Because Need To ANPRRedisData!`);
                                return;

                            }

                            // Check Detect RFID In Redis
                            // ==========================> RFID Is Detected

                        }

                        else { // For This Check ANPR | RFID Is Detect

                            // Check ANPR OR RFID Detect In Redis
                            // ==========================> RFID Is Detect


                            if (!anprRedisDetected) anprRedisData = null;
                        }

                        //#endregion

                    }

                    //#region Create IdentificationProcess By Type TrafficControl

                    await createProcess(gateId, IdentificationProcessTrafficType.TrafficControl, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion

                }

            }

        }



        else if (anprRedisDetected) { // Start By ANPR Detection Process

            if (anprRedisData!.detectedData!.trafficType == IdentificationProcessTrafficType.Taxi) { // Founded In Taxi List

                var taxiWorkModeInfo = gateSetting.taxiWorkModeInfo;

                if (taxiWorkModeInfo.acceptanceType == AcceptanceType.All) { // For This Check HumanDetect & VehicleDetect && Match Driver By Vehicle

                    //#region  Check HumanDetect
                    // Because HumanDetectTools Just Contains HF Not Check HumanAcceptanceType

                    // Check HF Detect In Redis
                    if (!hfRedisDetected) {

                        //#region  Send Message To IdentityResultBox
                        var message: IOperator_IdentityResultBox_Model = {
                            description: 'کارت شناسایی را در محل مناسب قرار دهید',
                            messageType: IdentityMessageType.InsertTheCard,
                            type: IdentityResultType.Info,
                        };

                        io.to(gateId).emit("IdentityResultBox", message);
                        //#endregion

                        console.warn(`CheckDetection Failed Because Need To HFRedisData!`);
                        return;

                    }

                    //#endregion


                    //#region  Check VehicleDetect

                    if (taxiWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                        // Check Detect ANPR In Redis
                        // ==========================> ANPR Is Detected


                        // Check Detect RFID In Redis
                        if (!rfidRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی تگ رادیویی خودرو انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion

                            console.warn(`CheckDetection Failed Because Need To RFIDRedisData!`);
                            return;
                        }

                    }

                    else { // For This Check ANPR | RFID Is Detect

                        // Check ANPR OR RFID Detect In Redis
                        // ==========================> ANPR Is Detected

                        if (!rfidRedisDetected) rfidRedisData = null;
                    }

                    //#endregion


                    //#region  Check Driver Is Match By Vehicle

                    //TODO Check Match Driver By Vehicle


                    //#endregion


                    //#region Create IdentificationProcess By Type Taxi

                    await createProcess(gateId, IdentificationProcessTrafficType.Taxi, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion


                }

                else { // For This Check HumanDetect | VehicleDetect

                    if (!hfRedisDetected) { // Human Not Detected

                        hfRedisData = null;

                        //#region  Check VehicleDetect

                        if (taxiWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                            // Check Detect ANPR In Redis
                            // ==========================> ANPR Is Detected


                            // Check Detect RFID In Redis
                            if (!rfidRedisDetected) {

                                //#region  Send Message To IdentityResultBox
                                var message: IOperator_IdentityResultBox_Model = {
                                    description: 'شناسایی تگ رادیویی خودرو انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                    messageType: IdentityMessageType.IdentificationIsIncomplete,
                                    type: IdentityResultType.Info,
                                };

                                io.to(gateId).emit("IdentityResultBox", message);
                                //#endregion

                                console.warn(`CheckDetection Failed Because Need To RFIDRedisData!`);
                                return;
                            }

                        }

                        else { // For This Check ANPR | RFID Is Detect

                            // Check ANPR OR RFID Detect In Redis
                            // ==========================> ANPR Is Detected

                            if (!rfidRedisDetected) rfidRedisData = null;
                        }

                        //#endregion


                    }

                    //#region Create IdentificationProcess By Type Taxi

                    await createProcess(gateId, IdentificationProcessTrafficType.Taxi, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion

                }

            }
            else { // Founded In TrafficControl List

                var trafficControlWorkModeInfo = gateSetting.trafficControlWorkModeInfo;

                if (trafficControlWorkModeInfo.acceptanceType == AcceptanceType.All) { // For This Check HumanDetect & VehicleDetect && Match Driver By Vehicle

                    //#region  Check HumanDetect
                    // Because HumanDetectTools Just Contains HF Not Check HumanAcceptanceType

                    // Check HF Detect In Redis
                    if (!hfRedisDetected) {

                        //#region  Send Message To IdentityResultBox
                        var message: IOperator_IdentityResultBox_Model = {
                            description: 'کارت شناسایی را در محل مناسب قرار دهید',
                            messageType: IdentityMessageType.InsertTheCard,
                            type: IdentityResultType.Info,
                        };

                        io.to(gateId).emit("IdentityResultBox", message);
                        //#endregion

                        console.warn(`CheckDetection Failed Because Need To HFRedisData!`);
                        return;

                    }

                    //#endregion


                    //#region  Check VehicleDetect

                    if (trafficControlWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                        // Check Detect ANPR In Redis
                        // ==========================> ANPR Is Detected


                        // Check Detect RFID In Redis
                        if (!rfidRedisDetected) {

                            //#region  Send Message To IdentityResultBox
                            var message: IOperator_IdentityResultBox_Model = {
                                description: 'شناسایی تگ رادیویی خودرو انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                messageType: IdentityMessageType.IdentificationIsIncomplete,
                                type: IdentityResultType.Info,
                            };

                            io.to(gateId).emit("IdentityResultBox", message);
                            //#endregion

                            console.warn(`CheckDetection Failed Because Need To RFIDRedisData!`);
                            return;
                        }

                    }

                    else { // For This Check ANPR | RFID Is Detect

                        // Check ANPR OR RFID Detect In Redis
                        // ==========================> ANPR Is Detected

                        if (!rfidRedisDetected) rfidRedisData = null;
                    }

                    //#endregion

                    //#region Create IdentificationProcess By Type TrafficControl

                    await createProcess(gateId, IdentificationProcessTrafficType.TrafficControl, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion


                }

                else { // For This Check HumanDetect | VehicleDetect

                    if (!hfRedisDetected) { // Human Not Detected

                        hfRedisData = null;

                        //#region  Check VehicleDetect

                        if (trafficControlWorkModeInfo.vehicleAcceptanceType == AcceptanceType.All) { // For This Check ANPR & RFID Is Detect

                            // Check Detect ANPR In Redis
                            // ==========================> ANPR Is Detected


                            // Check Detect RFID In Redis
                            if (!rfidRedisDetected) {
        
                                //#region  Send Message To IdentityResultBox
                                var message: IOperator_IdentityResultBox_Model = {
                                    description: 'شناسایی تگ رادیویی خودرو انجام نشده است, خودرو را در محل مناسب قرار دهید',
                                    messageType: IdentityMessageType.IdentificationIsIncomplete,
                                    type: IdentityResultType.Info,
                                };

                                io.to(gateId).emit("IdentityResultBox", message);
                                //#endregion

                                console.warn(`CheckDetection Failed Because Need To RFIDRedisData!`);
                                return;
                            }

                        }

                        else { // For This Check ANPR | RFID Is Detect

                            // Check ANPR OR RFID Detect In Redis
                            // ==========================> ANPR Is Detected

                            if (!rfidRedisDetected) rfidRedisData = null;
                        }

                        //#endregion


                    }

                    //#region Create IdentificationProcess By Type TrafficControl

                    await createProcess(gateId, IdentificationProcessTrafficType.TrafficControl, anprRedisData, rfidRedisData, hfRedisData);

                    //#endregion

                }

            }

        }




    }

    const createProcess = async function (gateId: string, trafficType: IdentificationProcessTrafficType,
        anprInfo: ANPRCacheDataModel | null, rfidInfo: RFIDCacheDataModel | null, hfInfo: HFCacheDataModel | null) {

        var name_Process: string = '';
        var anpr_Process: boolean = false;
        var rfid_Process: boolean = rfidInfo && rfidInfo != null ? true : false;
        var plaqueNo_Process: string = '';
        var vehicleType_Process: string = '';
        var plaqueType_Process;
        var vehicleId_Process: string = '';
        var permissionTrafficGroupId_Process: string = '';


        if (trafficType == IdentificationProcessTrafficType.Taxi) {
            name_Process = anprInfo && anprInfo != null ?
                anprInfo?.detectedData?.vehicleIdentity ?? ''
                : rfidInfo && rfidInfo != null ? rfidInfo?.detectedData?.vehicleIdentity ?? '' : '';

        }
        else { // Traffic Control
            name_Process = anprInfo && anprInfo != null ?
                anprInfo?.detectedData?.name ?? ''
                : rfidInfo && rfidInfo != null ? rfidInfo?.detectedData?.name ?? ''
                    : hfInfo?.detectedData?.name ?? '';


            permissionTrafficGroupId_Process =
                anprInfo && anprInfo != null ?
                    anprInfo?.detectedData?.permissionTrafficGroupId ?? ''
                    : rfidInfo && rfidInfo != null ? rfidInfo?.detectedData?.permissionTrafficGroupId ?? ''
                        : hfInfo?.detectedData?.permissionTrafficGroupId ?? '';
        }


        if (anprInfo && anprInfo != null) {
            anpr_Process = true;
            plaqueNo_Process = anprInfo?.detectedData?.plaqueNo ?? '';
            vehicleType_Process = anprInfo?.detectedData?.vehicleType ?? '';
            plaqueType_Process = anprInfo?.detectedData?.plaqueType;

            vehicleId_Process = anprInfo?.detectedData?.vehicleId ?? '';


        }
        else if (rfidInfo && rfidInfo != null) {
            vehicleType_Process = rfidInfo?.detectedData?.vehicleType ?? '';
            vehicleId_Process = rfidInfo?.detectedData?.vehicleId ?? '';


        }

        var newProcess: IdentificationProcessModel = {
            gateId: gateId,
            trafficType: trafficType,
            startProcessTime: new Date(),
            status: IdentificationProcessStatus.UnSuccessful,
            finishedProcess: false,
            name: name_Process,
            hf: hfInfo && hfInfo.detected && hfInfo.detectedData ? true : false,
            anpr: anpr_Process,
            rfid: rfid_Process,

            plaqueNo: plaqueNo_Process,
            plaqueType: plaqueType_Process,
            vehicleType: vehicleType_Process,
            vehicleId: vehicleId_Process,

            driverFullName: hfInfo?.detectedData?.driverFullName ?? '',
            driverId: hfInfo?.detectedData?.driverId ?? '',

            permissionTrafficGroupId: permissionTrafficGroupId_Process
        };

        await identificationProcessService().addNewProcess(newProcess);

    }



    return {
        processRFIDTag,
        processANPRPlate,
        getSocketConnectInfoByToken,
        findGateServiceToGateSettingByToken,
        processHFCard
    }
}