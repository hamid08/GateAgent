
import operatorRepository from "../../frameworks/database/mongoDB/repositories/operatorRepository";
import {
    Operator_Gate_Model,
    Operator_GateDetails_Model,
    StatusConnectionCard,
    LivePlaqueImage,
    IOperator_IdentityResultBoxInfo_Model,
    IOperator_IdentityResultBox_Model,
    IdentificationProcessGridModel,
    IdentificationProcessGridFilterModel,

    OfflineTrafficsGridFilterModel,
    OfflineTrafficsGridModel,

    IDetectionStateANPRDataModel,
    IDetectionStateHFDataModel,
    IDetectionStateModel,
    IDetectionStateRFIDDataModel

} from '../models/operatorModels';

import { getConnectedSocket } from '../../frameworks/services/socket/connection';
import { GridResultModel } from '../models/baseModels';

import gateSettingService from "./gateSettingService";

import {
    GateIdentificationType,
    GateServicesType,
    IdentificationProcessFinishReason,
    IdentificationProcessStatus,
    IdentificationProcessTrafficType,
    IdentifierConnectionStatus,
    IdentityMessageType,
    IdentityResultType,
    TaxiWorkModeOperation,
    VehiclePlaqueType,

} from '../enums/gateEnum';

import identificationProcessService from './identificationProcessService';
import identificationProcessRedisRepository from '../../frameworks/database/redis/identificationProcessRedisRepository';
import mongoRepository from '../../frameworks/database/mongoDB/repositories/gateRepository';


import config from '../../config/config';


export default function operatorService() {

    var _redisRepository = identificationProcessRedisRepository();
    const _mongoRepository = mongoRepository();


    const getGates = async (): Promise<Operator_Gate_Model[] | null> => await operatorRepository().getGates();

    const getLivePlaqueImage = async (gateId: string): Promise<LivePlaqueImage | null> => {

        var cameras = await operatorRepository().getANPRCamerasByGateId(gateId);

        // TODO GetLatestPlateImageFrom ANPRListener

        if (cameras && cameras.length > 0) {

            return new LivePlaqueImage(
                config.socket.image64
                ,
                gateId,
                new Date()

            );
        }

        return null;

    }



    const detectionState = async (gateId: string): Promise<IDetectionStateModel> => {

        var processInfo = await identificationProcessService().getRunProcessByGateId(gateId);

        var hfRedisData = await _redisRepository.getHF(gateId);
        var anprRedisData = await _redisRepository.getANPR(gateId);
        var rfidRedisData = await _redisRepository.getRFID(gateId);

        var anprDetection: IDetectionStateANPRDataModel = {
            dateTime: anprRedisData?.pureData.DateTime!,
            found: anprRedisData?.detected!,
            gateId: anprRedisData?.pureData.GateId!,
            image: anprRedisData?.pureData.image!,
            name: anprRedisData?.detected && anprRedisData?.detectedData
                ? anprRedisData?.detectedData?.name : '',

            plaqueNo: anprRedisData?.detected && anprRedisData?.detectedData
                ? anprRedisData?.detectedData?.plaqueNo : '',

            plaqueType: anprRedisData?.detected && anprRedisData?.detectedData
                ? anprRedisData?.detectedData?.plaqueType : undefined,

            vehicleIdentity: anprRedisData?.detected && anprRedisData?.detectedData
                ? anprRedisData?.detectedData?.vehicleIdentity : '',
        }


        var rfidDetection: IDetectionStateRFIDDataModel = {
            found: rfidRedisData?.detected!,
            gateId: rfidRedisData?.pureData.GateId!,
            name: rfidRedisData?.detected && rfidRedisData?.detectedData
                ? rfidRedisData?.detectedData?.name : '',

            plaqueNo: rfidRedisData?.detected && rfidRedisData?.detectedData
                ? rfidRedisData?.detectedData?.plaqueNo : '',

            plaqueType: rfidRedisData?.detected && rfidRedisData?.detectedData
                ? rfidRedisData?.detectedData?.plaqueType : undefined,

            vehicleIdentity: rfidRedisData?.detected && rfidRedisData?.detectedData
                ? rfidRedisData?.detectedData?.vehicleIdentity : '',
        }


        var hfDetection: IDetectionStateHFDataModel = {
            found: hfRedisData?.detected!,
            gateId: hfRedisData?.pureData.gateId!,
            name: hfRedisData?.detected && hfRedisData?.detectedData
                ? hfRedisData?.detectedData?.name : '',

            image: hfRedisData?.detected && hfRedisData?.detectedData
                ? hfRedisData?.detectedData?.driverAvatar : '',
        }


        var needTripNumber: boolean = false;
        var hasProcess: boolean = false;

        var gateSetting = await _mongoRepository.getSmartGateProccessInfoById(gateId);

        if (processInfo && processInfo != null) {
            hasProcess = true;

            if (processInfo?.trafficType == IdentificationProcessTrafficType.Taxi &&
                gateSetting?.taxiWorkModeInfo.taxiOperation == TaxiWorkModeOperation.AssignTripToDriver) {

                needTripNumber = true;
            }

        }


        var detectionState: IDetectionStateModel = {
            hasProcess,
            needTripNumber,
            anprData: anprRedisData && anprRedisData != null ? anprDetection : undefined,
            hfData: hfRedisData && hfRedisData != null ? hfDetection : undefined,
            rfidData: rfidRedisData && rfidRedisData != null ? rfidDetection : undefined,
        }

        return detectionState;
    }


    const cancelProcess = async (gateId: string): Promise<IOperator_IdentityResultBox_Model> => {

        await identificationProcessService().finishProcessInGate(gateId, IdentificationProcessStatus.UnSuccessful, IdentificationProcessFinishReason.CancelByOperator);

        var message: IOperator_IdentityResultBox_Model = {
            description: 'فرآیند شناسایی و عملیات لغو شد',
            messageType: IdentityMessageType.CancelProcess,
            type: IdentityResultType.Error
        };

        return message;

    }





    const finishProcess = async (gateId: string, tripNumber?: string): Promise<IOperator_IdentityResultBox_Model> => {

        //TODO Get Run Process And Check Need To Call Gate Service And FinishProcess And Check FinishProcess Offline OR Online


        await identificationProcessService().finishProcessInGate(gateId, IdentificationProcessStatus.Successful, IdentificationProcessFinishReason.FinishProcess);

        var identityInfo: IOperator_IdentityResultBoxInfo_Model = {
            name: 'علی حیدری',
            vehicleIdentity: '1A4Bn'
        };

        var message: IOperator_IdentityResultBox_Model = {
            description: 'اختصاص سفر به راننده با موفقیت انجام شد',
            messageType: IdentityMessageType.AllowedToPass,
            type: IdentityResultType.Success,
            identityInfo: identityInfo
        };

        return message;

    }


    const getGateDetailsById = async (gateId: string): Promise<Operator_GateDetails_Model | null> => {
        var data = await operatorRepository().getGateDetailsById(gateId);


        var sockets = await getConnectedSocket();

        var anprSocketInfo = sockets?.find(x => x.type == GateServicesType.ANPRListener);

        var rfidSocketInfo = sockets?.find(x => x.type == GateServicesType.RFIDListener);

        data?.statusConnectionCard.forEach(async c => {

            switch (c.type) {
                case GateIdentificationType.ServiceServer:

                    var gateServiceAddress = await gateSettingService().getGateServiceAddress();
                    if (gateServiceAddress && gateServiceAddress != '') {

                        c.status = await gateSettingService().testGateServiceAddress(gateServiceAddress) ? IdentifierConnectionStatus.Connect : IdentifierConnectionStatus.Disconnect;
                    }

                    break;

                case GateIdentificationType.ANPR:

                    if (anprSocketInfo && anprSocketInfo != null) {
                        c.status = IdentifierConnectionStatus.Connect;
                    }

                    break;

                case GateIdentificationType.RFID:

                    if (rfidSocketInfo && rfidSocketInfo != null) {
                        c.status = IdentifierConnectionStatus.Connect;
                    }

                    break;
            }


        });

        return data;

    }



    const connectionTest = async (gateId: string, type: GateIdentificationType): Promise<StatusConnectionCard | null> => {


        var data = await operatorRepository().getStatusConnectionItemsByType(gateId, type);

        if (data == null) {
            return null;
        }

        switch (type) {
            case GateIdentificationType.ServiceServer:

                var gateServiceAddress = await gateSettingService().getGateServiceAddress();
                if (gateServiceAddress && gateServiceAddress != '') {

                    data.status = await gateSettingService().testGateServiceAddress(gateServiceAddress) ? IdentifierConnectionStatus.Connect : IdentifierConnectionStatus.Disconnect;
                }

                break;

        }
        return data;

    }


    const identificationProcessGrid = async (gateId: string, filterModel: IdentificationProcessGridFilterModel)
        : Promise<GridResultModel> => {
        try {
            return await operatorRepository().identificationProcessGrid(gateId, filterModel);

        } catch (error) {
            console.error(error)
            throw new Error();

        }
    };

    const offlineTrafficsGrid = async (gateId: string, filterModel: OfflineTrafficsGridFilterModel)
        : Promise<GridResultModel> => {
        try {
            return await operatorRepository().offlineTrafficsGrid(gateId, filterModel);

        } catch (error) {
            console.error(error)
            throw new Error();

        }
    };



    return {
        getGates,
        getGateDetailsById,
        connectionTest,
        getLivePlaqueImage,
        finishProcess,
        identificationProcessGrid,
        offlineTrafficsGrid,
        detectionState,
        cancelProcess
    }

}