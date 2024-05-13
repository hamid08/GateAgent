import { Schema, model } from 'mongoose';

import {
    TaxiWorkModeOperation,
    OfflineTrafficsType,
    VehiclePlaqueType

}
    from '../../../../application/enums/gateEnum';



interface IOfflineTraffic {
    registerDate: Date,
    vehicleIdentity?: string,
    status: OfflineTrafficsType,
    tripNumber?: string,
    plaqueNo?: string,
    plaqueType?: VehiclePlaqueType,
    hf: boolean,
    rfid: boolean,
    anpr: boolean,
    gateId: string,
    driverFullName: string,
    taxiOperation: TaxiWorkModeOperation
    vehicleId?: string,
    driverId?: string,
    vehicleType?: string,

}


const offlineTrafficSchema = new Schema<IOfflineTraffic>({
    registerDate: { type: Date, required: true, default: new Date() },
    vehicleIdentity: { type: String, required: false },
    status: { type: Number, enum: OfflineTrafficsType },
    tripNumber: { type: String, required: false },
    plaqueNo: { type: String, required: false },
    plaqueType: { type: Number, enum: VehiclePlaqueType,required:false },
    hf:Boolean,
    rfid:Boolean,
    anpr:Boolean,

    gateId: { type: String, required: true, index: true },

    driverFullName: { type: String, required: false },
    taxiOperation: { type: Number, enum: TaxiWorkModeOperation },
    vehicleId: { type: String, required: false },
    driverId: { type: String, required: false },
    vehicleType: { type: String, required: false },
});


export const OfflineTraffic = model<IOfflineTraffic>('OfflineTraffic', offlineTrafficSchema);