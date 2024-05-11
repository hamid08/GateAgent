import { Schema, model } from 'mongoose';

import {
    SmartGateType,
    HumanDetectTools,
    ReactionAfterSuccessfulOperation,
    ReactionAfterUnSuccessfulOperation,
    SupervisoryType,
    VehicleDetectTools,
    SmartGatePriority,
    TaxiWorkModeOperation,
    AcceptanceType
} from '../../../../application/enums/gateEnum';


interface IAnprCamera {
    caption: string,
    identity: string,
    ip?: string,
    port?: number,
    intervalTime: number
}

const anprCameraSchema = new Schema<IAnprCamera>({
    caption: { type: String, required: true },
    identity: { type: String, required: true },
    ip: { type: String, required: false },
    port: { type: Number, required: false },
    intervalTime: { type: Number, required: true },
}, { _id: false });


interface IRfidAntenna {
    caption: string,
    identity: string,
    ip: string,
    port: number,
    intervalTime: number
}

const rfidAntennaSchema = new Schema<IRfidAntenna>({
    caption: { type: String, required: true },
    identity: { type: String, required: true },
    ip: { type: String, required: true },
    port: { type: Number, required: true },
    intervalTime: { type: Number, required: true },


}, { _id: false });



interface ISmartGateWorkMode {

    taxiOperation: TaxiWorkModeOperation,
    priority: SmartGatePriority,
    acceptanceType: AcceptanceType,

    humanDetect: boolean,
    humanDetectTools: HumanDetectTools[],
    humanAcceptanceType: AcceptanceType,

    vehicleDetect: boolean,
    vehicleDetectTools: VehicleDetectTools[],
    vehicleAcceptanceType: AcceptanceType,

}


const smartGateWorkModeSchema = new Schema<ISmartGateWorkMode>({
    acceptanceType: { type: Number, enum: AcceptanceType },
    humanAcceptanceType: { type: Number, enum: AcceptanceType },
    humanDetect: Boolean,
    humanDetectTools: [{ type: Number, enum: HumanDetectTools }],
    priority: { type: Number, enum: SmartGatePriority },
    taxiOperation: { type: Number, enum: TaxiWorkModeOperation },
    vehicleAcceptanceType: { type: Number, enum: AcceptanceType },
    vehicleDetect: Boolean,
    vehicleDetectTools: [{ type: Number, enum: VehicleDetectTools }],
}, { _id: false });



interface ISmartGate {
    id: string,
    identity: string,
    caption: string,
    terminalCaption: string,
    description: string,
    gateType: SmartGateType,

    taxiWorkMode: boolean,
    taxiWorkModeInfo: ISmartGateWorkMode,

    trafficControlWorkMode: boolean,
    trafficControlWorkModeInfo: ISmartGateWorkMode,


    supervisoryType: SupervisoryType,
    checkInSupervisoryGateCaption: string,
    allowTimeSupervisoryGate: number,

    reactionAfterSuccessfulOperations: ReactionAfterSuccessfulOperation[],
    reactionAfterUnSuccessfulOperations: ReactionAfterUnSuccessfulOperation[],

    offlineMode: boolean,

    anprCameras: IAnprCamera[],
    rfidAntennas: IRfidAntenna[],
}


const smartGateSchema = new Schema<ISmartGate>({
    id: String,
    identity: { type: String, required: true, index: true },
    caption: String,
    terminalCaption: String,
    description: String,

    gateType: { type: Number, enum: SmartGateType },

    taxiWorkMode: Boolean,
    taxiWorkModeInfo: smartGateWorkModeSchema,
    trafficControlWorkMode: Boolean,
    trafficControlWorkModeInfo: smartGateWorkModeSchema,

    supervisoryType: { type: Number, enum: SupervisoryType },
    checkInSupervisoryGateCaption: String,
    allowTimeSupervisoryGate: Number,

    reactionAfterSuccessfulOperations: [{ type: Number, enum: ReactionAfterSuccessfulOperation }],
    reactionAfterUnSuccessfulOperations: [{ type: Number, enum: ReactionAfterUnSuccessfulOperation }],
    offlineMode: Boolean,

    anprCameras: [anprCameraSchema],
    rfidAntennas: [rfidAntennaSchema]
});


export const SmartGate = model<ISmartGate>('SmartGate', smartGateSchema);