import { Schema, model } from 'mongoose';

import {
    IdentificationProcessStatus,
    IdentificationProcessTrafficType,
    VehiclePlaqueType
}
    from '../../../../application/enums/gateEnum';



interface IIdentificationProcess {
    gateId: string,
    startProcessTime: Date,
    endProcessTime: Date,
    status: IdentificationProcessStatus, // وضعیت
    finishedProcess: boolean,
    name: string, // شناسه / نام


    trafficType: IdentificationProcessTrafficType, // نوع تردد
    permissionTrafficGroupId?: string, // شناسه کنترل ترددی
    vehicleId?: string, // شناسه خودرو
    driverId?: string,
    hf: boolean,
    anpr: boolean,
    rfid: boolean,

    hfData?: string,
    anprData?: string,
    rfidData?: string,

    plaqueNo?: string,
    plaqueType?: VehiclePlaqueType,
    vehicleType?: string,




}


const identificationProcessSchema = new Schema<IIdentificationProcess>({
    gateId: { type: String, required: true, index: true },
    startProcessTime: Date,
    endProcessTime: Date,
    status: { type: Number, enum: IdentificationProcessStatus },
    finishedProcess: Boolean,
    name: { type: String, required: false },
    trafficType: { type: Number, enum: IdentificationProcessTrafficType },
    permissionTrafficGroupId: { type: String, required: false },
    vehicleId: { type: String, required: false },
    driverId: { type: String, required: false },

    hf: { type: Boolean, default: false },
    anpr: { type: Boolean, default: false },
    rfid: { type: Boolean, default: false },

    hfData: { type: String, required: false },
    anprData: { type: String, required: false },
    rfidData: { type: String, required: false },


    plaqueNo: { type: String, required: false },
    plaqueType: { type: Number, enum: VehiclePlaqueType, required: false },
    vehicleType: { type: String, required: false },

});


export const IdentificationProcess = model<IIdentificationProcess>('IdentificationProcess', identificationProcessSchema);