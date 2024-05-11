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

    identity?: string,

    plaqueNo?: string,
    plaqueType?: VehiclePlaqueType,
    vehicleUserType?: string,




}


const identificationProcessSchema = new Schema<IIdentificationProcess>({
    driverId: { type: String, required: false },
    vehicleId: { type: String, required: false },
    permissionTrafficGroupId: { type: String, required: false },

    gateId: { type: String, required: true, index: true },
    startProcessTime: Date,
    endProcessTime: Date,
    finishedProcess: Boolean,
    status: { type: Number, enum: IdentificationProcessStatus },
    trafficType: { type: Number, enum: IdentificationProcessTrafficType },

    hf: { type: Boolean, default: false },
    anpr: { type: Boolean, default: false },
    rfid: { type: Boolean, default: false },

    hfData: { type: String, required: false },
    anprData: { type: String, required: false },
    rfidData: { type: String, required: false },

    identity: { type: String, required: false },

    plaqueNo: { type: String, required: false },
    plaqueType: { type: Number, enum: VehiclePlaqueType, required: false },
    vehicleUserType: { type: String, required: false },

});


export const IdentificationProcess = model<IIdentificationProcess>('IdentificationProcess', identificationProcessSchema);