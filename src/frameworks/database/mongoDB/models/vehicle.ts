import { Schema, model } from 'mongoose';
import {
    VehiclePlaqueType, PlaqueStatus
} from '../../../../application/enums/gateEnum';

interface IDriver {
    nationalNo: string,
    fName: string,
    lName: string,
    userImage: string,
}

interface IVehicle {
    id: string,
    identity: string,
    plaqueNo: string,
    rfidTag: string,
    plaqueType: VehiclePlaqueType,
    plaqueStatus: PlaqueStatus,
    transportationUnitCaption: string,
    transportationCompanyCaption: string,
    vehicleUserTypeCaption: string,
    vehicleCategoryCaption: string,
    currentDriver: IDriver
}

const driverSchema = new Schema<IDriver>({
    nationalNo: { type: String, required: true },
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    userImage: { type: String, required: false },
}, { _id: false });


const vehicleSchema = new Schema<IVehicle>({
    id: String,
    plaqueNo: { type: String, required: true, index: true },
    identity: { type: String, required: true },
    rfidTag: { type: String, required: true, index: true },
    plaqueStatus: { type: Number, enum: PlaqueStatus },
    plaqueType: { type: Number, enum: VehiclePlaqueType },
    transportationCompanyCaption: String,
    transportationUnitCaption: String,
    vehicleCategoryCaption: String,
    vehicleUserTypeCaption: String,
    currentDriver: driverSchema,
});


vehicleSchema.index({ rfidTag: 1, plaqueNo: 1 });
export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);