import { Schema, model } from 'mongoose';

import {
    IdentificationProcessFinishReason,
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
    name: string, // شناسه خودرو / نام


    hf: boolean,
    anpr: boolean,
    rfid: boolean,

    trafficType: IdentificationProcessTrafficType, // نوع تردد

    permissionTrafficGroupId?: string, // شناسه کنترل ترددی
    vehicleId?: string, // شناسه خودرو
    driverId?: string,

    driverFullName?: string,

    plaqueNo?: string,
    plaqueType?: VehiclePlaqueType,
    vehicleType?: string,

    finishedReason?: IdentificationProcessFinishReason



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

    driverFullName: { type: String, required: false },


    plaqueNo: { type: String, required: false },
    plaqueType: { type: Number, enum: VehiclePlaqueType, required: false },
    vehicleType: { type: String, required: false },

    finishedReason: { type: Number, enum: IdentificationProcessFinishReason, required: false },


});


export default model<IIdentificationProcess>('IdentificationProcess', identificationProcessSchema);