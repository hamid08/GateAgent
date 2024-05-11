import { Schema, model } from 'mongoose';

import {
    TaxiWorkModeOperation
}
    from '../../../../application/enums/gateEnum';



interface IOfflineTraffic {
    gateId: string,
    registerDate: Date,
    taxiOperation: TaxiWorkModeOperation
    vehicleId?: string,
    driverId?: string,
    tripNumber?: string,
    isSent: boolean
}


const offlineTrafficSchema = new Schema<IOfflineTraffic>({
    gateId: { type: String, required: true, index: true },
    driverId: { type: String, required: false },
    vehicleId: { type: String, required: false },

    registerDate: Date,
    taxiOperation: { type: Number, enum: TaxiWorkModeOperation },
    tripNumber: { type: String, required: false },
    isSent: Boolean,


});


export const OfflineTraffic = model<IOfflineTraffic>('OfflineTraffic', offlineTrafficSchema);