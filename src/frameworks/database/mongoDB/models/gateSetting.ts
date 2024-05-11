import { Schema, model } from 'mongoose';


import {
    GateServicesType
} from '../../../../application/enums/gateEnum';

export interface IGateServices {
    type: GateServicesType,
    token: string,
}

const gateServicesSchema = new Schema<IGateServices>({
    type: { type: Number, enum: GateServicesType, required: true },
    token: { type: String, required: true, index: true },
}, { _id: false });



export interface IGateSetting {
    gateServiceAddress: string,
    gateIds: string[],
    gateServices: IGateServices[]
}


const gateSettingSchema = new Schema<IGateSetting>({
    gateIds: [{ type: String, index: true }],
    gateServiceAddress: { type: String },
    gateServices: {
        type: [gateServicesSchema],
        default: []
    }
});


export const GateSetting = model<IGateSetting>('GateSetting', gateSettingSchema);