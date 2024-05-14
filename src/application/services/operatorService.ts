
import operatorRepository from "../../frameworks/database/mongoDB/repositories/operatorRepository";
import {
    Operator_Gate_Model,
    Operator_GateDetails_Model,
    StatusConnectionCard,
    LivePlaqueImage,
    Operator_IdentityResultBoxInfo_Model,
    Operator_IdentityResultBox_Model,
    IdentificationProcessGridModel,
    IdentificationProcessGridFilterModel,

    OfflineTrafficsGridFilterModel,
    OfflineTrafficsGridModel,

    DetectionStateANPRDataModel,
    DetectionStateHFDataModel,
    DetectionStateModel,
    DetectionStateRFIDDataModel

} from '../models/operatorModels';

import { getConnectedSocket } from '../../frameworks/services/socket/connection';
import { GridResultModel } from '../models/baseModels';

import gateSettingService from "./gateSettingService";

import {
    GateIdentificationType,
    GateServicesType,
    IdentifierConnectionStatus,
    IdentityMessageType,
    IdentityResultType,
    VehiclePlaqueType,

} from '../enums/gateEnum';

import { testAvailableIpPort } from '../utils/generators';

import config from '../../config/config';


export default function gateService() {



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



    const detectionState = async (gateId: string): Promise<DetectionStateModel> => {

        return new DetectionStateModel(
            false,
            false,
            new DetectionStateANPRDataModel(
                '640f5b',
                true,
                new Date(),
                config.socket.image64,
                '',
                'B208',
                '82-ت-686-22',
                VehiclePlaqueType.Taxi,
            ),
            new DetectionStateRFIDDataModel(
                '640f5b',
                true,
                '',
                'B208',
                '45-الف-586-22',
                VehiclePlaqueType.Taxi,
            ),
            undefined,
            new Operator_IdentityResultBox_Model(
                IdentityResultType.Info,
                IdentityMessageType.InsertTheCard,
                'لطفا کارت را بروی کارتخوان قرار دهید',
            )


        );

    }








    const finishProcess = async (gateId: string, tripNumber?: string): Promise<Operator_IdentityResultBox_Model> => {

        //TODO Save InDb Information And Finish Process




        return new Operator_IdentityResultBox_Model(IdentityResultType.Success, IdentityMessageType.AllowedToPass, 'اختصاص سفر به راننده با موفقیت انجام شد',
            new Operator_IdentityResultBoxInfo_Model('علی حیدری', '1A4Bn')
        );

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

                    if (anprSocketInfo) {
                        c.status = IdentifierConnectionStatus.Connect;
                    }

                    break;

                case GateIdentificationType.RFID:

                    if (rfidSocketInfo) {
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
        detectionState
    }

}