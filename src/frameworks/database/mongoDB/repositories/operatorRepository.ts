import { SmartGate } from "../models/smartGate";
import {
    Operator_Gate_Model,
    Operator_GateDetails_Model,
    StatusConnectionCardItemTooltipInfo,
    StatusConnectionCardItems,
    StatusConnectionCard

} from '../../../../application/models/operatorModels';

import {
    HumanDetectTools,
    SyncDataType, VehicleDetectTools,
    IdentifierConnectionStatus,
    GateIdentificationType

} from '../../../../application/enums/gateEnum';
import { AnprCamera, RfidAntenna } from "../../../../application/models/smartGateModels";


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

        var statusConnectionCardItems: StatusConnectionCardItems;

        switch (type) {

            case GateIdentificationType.NetAccess:
                var netAccessItems: StatusConnectionCardItems[] = [];
                netAccessItems.push(new StatusConnectionCardItems('NetAccess', IdentifierConnectionStatus.Disconnect, undefined));

                return new StatusConnectionCard(GateIdentificationType.NetAccess, 10, netAccessItems);


            case GateIdentificationType.RFID:
                var rfidItems: StatusConnectionCardItems[] = [];
                rfidItems = document.rfidAntennas.map(rfid =>
                    new StatusConnectionCardItems(rfid.caption, IdentifierConnectionStatus.Disconnect,
                        new StatusConnectionCardItemTooltipInfo(rfid.intervalTime, rfid.ip, rfid.port)
                    )
                );

                return new StatusConnectionCard(GateIdentificationType.RFID, 30, rfidItems);

            case GateIdentificationType.ANPR:
                var anprItems: StatusConnectionCardItems[] = [];
                anprItems = document.anprCameras.map(anpr =>
                    new StatusConnectionCardItems(anpr.caption, IdentifierConnectionStatus.Disconnect,
                        new StatusConnectionCardItemTooltipInfo(anpr.intervalTime, anpr.ip, anpr.port)
                    )
                );

                return new StatusConnectionCard(GateIdentificationType.ANPR, 30, anprItems);

            case GateIdentificationType.Kiosk:
                var kioskItems: StatusConnectionCardItems[] = [];
                kioskItems.push(new StatusConnectionCardItems('Kiosk', IdentifierConnectionStatus.Disconnect, undefined));
                return new StatusConnectionCard(GateIdentificationType.Kiosk, 30, kioskItems);


            default: return null;
        }



    }


    const getGateDetailsById = async (gateId: string): Promise<Operator_GateDetails_Model | null> => {

        const document = await SmartGate.findOne({ identity: gateId });

        if (!document) {
            return null;
        }

        var statusConnectionCards: StatusConnectionCard[] = [];

        //NetAccess
        var netAccessItems: StatusConnectionCardItems[] = [];
        netAccessItems.push(new StatusConnectionCardItems('NetAccess', IdentifierConnectionStatus.Disconnect, undefined));

        statusConnectionCards.push(new StatusConnectionCard(GateIdentificationType.NetAccess, 10, netAccessItems));

        //RFID
        var rfidItems: StatusConnectionCardItems[] = [];
        rfidItems = document.rfidAntennas.map(rfid =>
            new StatusConnectionCardItems(rfid.caption, IdentifierConnectionStatus.Disconnect,
                new StatusConnectionCardItemTooltipInfo(rfid.intervalTime, rfid.ip, rfid.port)
            )
        );

        statusConnectionCards.push(new StatusConnectionCard(GateIdentificationType.RFID, 30, rfidItems));

        //ANPR
        var anprItems: StatusConnectionCardItems[] = [];
        anprItems = document.anprCameras.map(anpr =>
            new StatusConnectionCardItems(anpr.caption, IdentifierConnectionStatus.Disconnect,
                new StatusConnectionCardItemTooltipInfo(anpr.intervalTime, anpr.ip, anpr.port)
            )
        );

        statusConnectionCards.push(new StatusConnectionCard(GateIdentificationType.ANPR, 30, anprItems));


        //Kiosk
        var kioskItems: StatusConnectionCardItems[] = [];
        kioskItems.push(new StatusConnectionCardItems('Kiosk', IdentifierConnectionStatus.Disconnect, undefined));
        statusConnectionCards.push(new StatusConnectionCard(GateIdentificationType.Kiosk, 30, kioskItems));


        var taxiOperation = document.taxiWorkModeInfo.taxiOperation;


        return new Operator_GateDetails_Model(
            document.identity,
            document.taxiWorkMode,
            document.offlineMode,
            document.trafficControlWorkMode,
            document.taxiWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.RFID) || document.trafficControlWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.RFID),
            document.taxiWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.ANPR) || document.trafficControlWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.ANPR),
            document.taxiWorkModeInfo.humanDetectTools.includes(HumanDetectTools.HF) || document.trafficControlWorkModeInfo.humanDetectTools.includes(HumanDetectTools.HF),
            IdentifierConnectionStatus.Disconnect,
            IdentifierConnectionStatus.Disconnect,
            IdentifierConnectionStatus.Disconnect,
            statusConnectionCards,
            taxiOperation
        );

    }


    return {
        getGates,
        getGateDetailsById,
        getStatusConnectionItemsByType,
        getANPRCamerasByGateId
    }

}