import { SmartGate } from "../models/smartGate";
import {
    Operator_Gate_Model,
    Operator_GateDetails_Model,
    StatusConnectionCard,
    IdentificationProcessGridFilterModel,
    IdentificationProcessGridModel,

    OfflineTrafficsGridFilterModel,
    OfflineTrafficsGridModel

} from '../../../../application/models/operatorModels';

import {
    HumanDetectTools,
    SyncDataType, VehicleDetectTools,
    IdentifierConnectionStatus,
    GateIdentificationType,
    OfflineTrafficsType,
    VehiclePlaqueType,
    IdentificationProcessStatus,
    IdentificationProcessTrafficType,
    GateIdentificationTestType

} from '../../../../application/enums/gateEnum';
import { AnprCamera, RfidAntenna } from "../../../../application/models/smartGateModels";

import { GridResultModel } from '../../../../application/models/baseModels';



export default function operatorRepository() {

    const getGates = async (): Promise<Operator_Gate_Model[] | null> => {

        try {

            return (await SmartGate.find()).map(c => new Operator_Gate_Model(c.identity, c.caption, c.terminalCaption));
        } catch (error) {
            return null;
        }


    }

    const getANPRCamerasByGateId = async (gateId: string): Promise<AnprCamera[] | null> => {

        const document = await SmartGate.findOne({ identity: gateId });

        if (!document) {
            return null;
        }

        return document.anprCameras.map(anpr => new AnprCamera(anpr.caption, anpr.identity, anpr.intervalTime, anpr.ip, anpr.port));

    }

    const getStatusConnectionItemsByType = async (gateId: string, type: GateIdentificationType): Promise<StatusConnectionCard | null> => {

        const document = await SmartGate.findOne({ identity: gateId });

        if (!document) {
            return null;
        }


        switch (type) {

            case GateIdentificationType.ServiceServer:

                return new StatusConnectionCard(
                    GateIdentificationType.ServiceServer,
                    GateIdentificationTestType.Server,
                    false,
                    IdentifierConnectionStatus.Disconnect,
                    10

                );


            case GateIdentificationType.LocalAgent:
                return new StatusConnectionCard(
                    GateIdentificationType.LocalAgent,
                    GateIdentificationTestType.Server,
                    true,
                    IdentifierConnectionStatus.Connect,
                    15

                );


            default: return null;
        }



    }


    const getGateDetailsById = async (gateId: string): Promise<Operator_GateDetails_Model | null> => {

        const document = await SmartGate.findOne({ identity: gateId });

        if (!document) {
            return null;
        }


        var rfidStatus: boolean = document.taxiWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.RFID) || document.trafficControlWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.RFID);
        var anprStatus: boolean = document.taxiWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.ANPR) || document.trafficControlWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.ANPR);
        var hfStatus: boolean = document.taxiWorkModeInfo.humanDetectTools.includes(HumanDetectTools.HF) || document.trafficControlWorkModeInfo.humanDetectTools.includes(HumanDetectTools.HF);

        var statusConnectionCards: StatusConnectionCard[] = [];

        //NetAccess
        statusConnectionCards.push(new StatusConnectionCard(
            GateIdentificationType.NetAccess,
            GateIdentificationTestType.Client,
            true,
            IdentifierConnectionStatus.Connect,
            0
        ));


        //ANPR
        if (anprStatus) {
            statusConnectionCards.push(new StatusConnectionCard(
                GateIdentificationType.ANPR,
                GateIdentificationTestType.Socket,
                true,
                IdentifierConnectionStatus.Disconnect,
                0
            ));
        }


        //RFID
        if (rfidStatus) {
            statusConnectionCards.push(new StatusConnectionCard(
                GateIdentificationType.RFID,
                GateIdentificationTestType.Socket,
                true,
                IdentifierConnectionStatus.Disconnect,
                0
            ));
        }

        //LocalAgent
        statusConnectionCards.push(new StatusConnectionCard(
            GateIdentificationType.LocalAgent,
            GateIdentificationTestType.Server,
            true,
            IdentifierConnectionStatus.Connect,
            15
        ));

        //ServiceServer
        statusConnectionCards.push(new StatusConnectionCard(
            GateIdentificationType.ServiceServer,
            GateIdentificationTestType.Server,
            false,
            IdentifierConnectionStatus.Disconnect,
            10
        ));

        var taxiOperation = document.taxiWorkModeInfo.taxiOperation;


        return new Operator_GateDetails_Model(
            document.identity,
            document.taxiWorkMode,
            document.offlineMode,
            document.trafficControlWorkMode,
            rfidStatus,
            anprStatus,
            hfStatus,
            statusConnectionCards,
            taxiOperation
        );

    }


    async function identificationProcessGrid(gateId: string, filterModel: IdentificationProcessGridFilterModel): Promise<GridResultModel> {

        var { searchTerm, pageIndex, pageSize, dateTime,
            name,
            status,
            plaqueNo,
            trafficType
        } = filterModel;

        if (pageIndex <= 0) pageIndex = 1;
        if (pageSize <= 0) pageSize = 10;

        // const query: any = {
        //     gateId,
        //     $or: [
        //         { plaqueNo: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //         { presenterName: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //         { rfidTag: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //         { trafficGroupCaption: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //         { name: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //     ],
        // };

        // if (fromDate) {
        //     query.fromDate = { $gte: new Date(fromDate) };
        // }

        // if (toDate) {
        //     query.toDate = { $lte: new Date(toDate) };
        // }


        // const documents = await TrafficGroup.find(query)
        //     .skip((pageIndex - 1) * pageSize)
        //     .limit(pageSize)
        //     .sort({ name: 1 })
        //     .populate('gateId')
        //     .exec();


        // var data = documents.map(document =>
        //     new TrafficGroupGridModel(
        //         document.trafficGroupCaption,
        //         document.plaqueNo,
        //         document.plaqueType,
        //         document.plaqueStatus,
        //         replaceChars(document.rfidTag),
        //         document.fromDate,
        //         document.toDate,
        //         document.name,
        //         document.presenterName,
        //         document.description,
        //         replaceChars(document.cardNumber),
        //     ));


        var data: IdentificationProcessGridModel[] = [];

        for (var i = 0; i < 45; i++) {

            data.push(new IdentificationProcessGridModel(
                new Date(),
                'ماشین وزیر راه' + i,
                IdentificationProcessStatus.Successful,
                '45-الف-586-22',
                VehiclePlaqueType.Personal,
                true,
                true,
                'علی حیدری' + i,
                'سواری پلاس',
                IdentificationProcessTrafficType.TrafficControl

            ));
        }

        var total: number = 0;

        try {
            total = data.length;
        } catch (error) {

        }

        return new GridResultModel(data, total, pageIndex, pageSize);


    }

    async function offlineTrafficsGrid(gateId: string, filterModel: OfflineTrafficsGridFilterModel): Promise<GridResultModel> {

        var { searchTerm, pageIndex, pageSize, dateTime,
            tripNumber,
            plaqueNo,
        } = filterModel;

        if (pageIndex <= 0) pageIndex = 1;
        if (pageSize <= 0) pageSize = 10;

        // const query: any = {
        //     gateId,
        //     $or: [
        //         { plaqueNo: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //         { presenterName: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //         { rfidTag: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //         { trafficGroupCaption: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //         { name: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        //     ],
        // };

        // if (fromDate) {
        //     query.fromDate = { $gte: new Date(fromDate) };
        // }

        // if (toDate) {
        //     query.toDate = { $lte: new Date(toDate) };
        // }


        // const documents = await TrafficGroup.find(query)
        //     .skip((pageIndex - 1) * pageSize)
        //     .limit(pageSize)
        //     .sort({ name: 1 })
        //     .populate('gateId')
        //     .exec();


        // var data = documents.map(document =>
        //     new TrafficGroupGridModel(
        //         document.trafficGroupCaption,
        //         document.plaqueNo,
        //         document.plaqueType,
        //         document.plaqueStatus,
        //         replaceChars(document.rfidTag),
        //         document.fromDate,
        //         document.toDate,
        //         document.name,
        //         document.presenterName,
        //         document.description,
        //         replaceChars(document.cardNumber),
        //     ));


        var data: OfflineTrafficsGridModel[] = [];

        for (var i = 0; i < 45; i++) {

            data.push(new OfflineTrafficsGridModel(
                new Date(),
                'DSS54' + i,
                OfflineTrafficsType.Successful,
                'T1-030228-0132',
                '45-الف-586-22',
                VehiclePlaqueType.Personal,
                true,
                true,
                `علی حیدری ${i}`,
                'سواری پلاس'

            ));
        }


        var total: number = 0;

        try {
            total = data.length;
        } catch (error) {

        }

        return new GridResultModel(data, total, pageIndex, pageSize);


    }


    return {
        getGates,
        getGateDetailsById,
        getStatusConnectionItemsByType,
        getANPRCamerasByGateId,
        identificationProcessGrid,
        offlineTrafficsGrid
    }

}