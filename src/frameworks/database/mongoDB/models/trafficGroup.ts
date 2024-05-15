import { Schema, model } from 'mongoose';
import {
    VehiclePlaqueType,PlaqueStatus
} from '../../../../application/enums/gateEnum';

interface ITrafficGroup {
    id: string,
    plaqueNo: string,
    plaqueType: VehiclePlaqueType,
    plaqueStatus:PlaqueStatus,
    rfidTag: string,
    gateIds: string[],
    name: string,
    presenterName: string,
    trafficGroupCaption: string,
    fromDate: Date,
    toDate: Date,
    description: string,
    cardNumber: string,
}


const trafficGroupSchema = new Schema<ITrafficGroup>({
    id: String,
    plaqueNo: { type: String, required: true, index: true },
    plaqueType: { type: Number, enum: VehiclePlaqueType },
    plaqueStatus: { type: Number, enum: PlaqueStatus },
    rfidTag: { type: String, required: true, index: true },
    gateIds: [{ type: String, required: true, index: true }],
    name: String,
    presenterName: String,
    trafficGroupCaption: String,
    fromDate: Date,
    toDate: Date,
    description: String,
    cardNumber:String
});


trafficGroupSchema.index({ rfidTag: 1, plaqueNo: 1, gateId: 1 });
export const TrafficGroup = model<ITrafficGroup>('TrafficGroup', trafficGroupSchema);