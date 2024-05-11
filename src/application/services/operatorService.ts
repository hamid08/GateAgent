
import operatorRepository from "../../frameworks/database/mongoDB/repositories/operatorRepository";
import {
    Operator_Gate_Model,
    Operator_GateDetails_Model,
    StatusConnectionCard

} from '../models/operatorModels';

import { getConnectedSocket } from '../../frameworks/services/socket/connection';

import {
    GateIdentificationType,
    GateServicesType,
    IdentifierConnectionStatus,

} from '../enums/gateEnum';

import { testAvailableIpPort } from '../utils/generators';

export default function gateService() {



    const getGates = async (): Promise<Operator_Gate_Model[] | null> => await operatorRepository().getGates();

    const getGateDetailsById = async (gateId: string): Promise<Operator_GateDetails_Model | null> => {
        var data = await operatorRepository().getGateDetailsById(gateId);


        var sockets = await getConnectedSocket();

        //ANPR Status
        var anprSocketInfo = sockets?.find(x => x.type == GateServicesType.ANPRListener);
        if (anprSocketInfo && data?.anprStatus) {
            data.anprStatus = IdentifierConnectionStatus.Connect;
        }

        //RFID Status
        var rfidSocketInfo = sockets?.find(x => x.type == GateServicesType.RFIDListener);
        if (rfidSocketInfo && data?.rfidStatus) {
            data.rfidStatus = IdentifierConnectionStatus.Connect;
        }

        //HF Status
        if (data?.hfStatus) {
            data.hfStatus = IdentifierConnectionStatus.Connect;
        }

        //Items Status
        data?.statusConnectionCard.forEach(async c => {
            c.items.forEach(async x => {
                x.status = IdentifierConnectionStatus.Connect;
            })

        });

        return data;

    }



    const connectionTest = async (gateId: string, type: GateIdentificationType): Promise<StatusConnectionCard | null> => {


        var data = await operatorRepository().getStatusConnectionItemsByType(gateId, type);


        data?.items.forEach(async c => {

            if (c.toolTipInfo) {
                var ip = c.toolTipInfo?.ip ?? '';
                var port = c.toolTipInfo?.port ?? 0;

                c.status = testAvailableIpPort(ip, port) ? IdentifierConnectionStatus.Connect : IdentifierConnectionStatus.Disconnect;
            }

        });


        return data;

    }



    return {
        getGates,
        getGateDetailsById,
        connectionTest
    }

}