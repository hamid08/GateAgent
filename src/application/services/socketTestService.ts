
import { getSocketIo } from '../../frameworks/services/socket/connection';

import {

    IdentityResultType,
    IdentityMessageType,
    VehiclePlaqueType,
    GateIdentificationType,
    IdentifierConnectionStatus
} from '../enums/gateEnum';

import config from '../../config/config';

export default function socketTestService() {

    var io = getSocketIo();

    const anprTest = async function (found: boolean) {


        await io.to('640f5b').emit("ANPRData", {

            image: config.socket.image64
            ,
            gateId: '640f5b',
            vehicleIdentity: 'B208',
            plaqueNo: '82-ت-686-22',
            plaqueType: VehiclePlaqueType.Personal,
            name: '',
            dateTime: new Date(),
            found,


        });



    }


    const identityResultBox = async function (type: IdentityResultType, messageType: IdentityMessageType) {
        await io.to('640f5b').emit("IdentityResultBox", {

            type,
            messageType,
            description: 'توضیحات',
            identityInfo: {
                name: 'حیدر علی حیدر',
                vehicleIdentity: '14542DDF'
            }
        });
    }


    const hfData = async function (found: boolean) {
        await io.to('640f5b').emit("HFData", {

            name: 'محمد علی حیدری',
            gateId: '640f5b',
            found,
            image: config.socket.driverAvatar64,

        });
    }


    const rfidData = async function (found: boolean) {
        await io.to('640f5b').emit("RFIDData", {

            plaqueType: VehiclePlaqueType.Personal,
            plaqueNo: '45-الف-586-22',
            vehicleIdentity: 'B208',
            name: '',
            gateId: '640f5b',
            found,

        });
    }


    const finishProcess = async function (needTripNumber: boolean) {
        await io.to('640f5b').emit("FinishProcess", {
            name: 'علی حیدری',
            vehicleIdentity: 'AD265',
            needTripNumber
        });
    }

    const identificationStatus = async function (type: GateIdentificationType, status: IdentifierConnectionStatus) {
        await io.to('640f5b').emit("IdentificationStatus", {
            type,
            status
        });
    }


    const identificationReadData = async function (type: GateIdentificationType) {
        await io.to('640f5b').emit("IdentificationReadData", {
            type,
        });
    }


    return {
        anprTest,
        hfData,
        rfidData,
        finishProcess,
        identityResultBox,
        identificationStatus,
        identificationReadData

    }
}