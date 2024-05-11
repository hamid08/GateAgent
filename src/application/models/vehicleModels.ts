import { PlaqueStatus, VehiclePlaqueType } from '../enums/gateEnum';

interface IDriver {
    nationalNo: string,
    fName: string,
    lName: string,
    userImage: string,
}

interface IVehicle {
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


export class DriverModel {

    constructor(nationalNo: string, fName: string, lName: string, userImage: string) {

        this.nationalNo = nationalNo;
        this.fName = fName;
        this.lName = lName;
        this.userImage = userImage;
    };

    nationalNo: string;
    fName: string;
    lName: string;
    userImage: string;
}


export class VehicleModel {

    constructor(
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
        currentDriver: IDriver) {

        this.id = id;
        this.identity = identity;
        this.plaqueNo = plaqueNo;
        this.rfidTag = rfidTag;
        this.plaqueType = plaqueType;
        this.plaqueStatus = plaqueStatus;
        this.transportationUnitCaption = transportationUnitCaption;
        this.transportationCompanyCaption = transportationCompanyCaption;
        this.vehicleUserTypeCaption = vehicleUserTypeCaption;
        this.vehicleCategoryCaption = vehicleCategoryCaption;
        this.currentDriver = currentDriver;

    }

    id: string;
    identity: string;
    plaqueNo: string;
    rfidTag: string;
    plaqueType: VehiclePlaqueType;
    plaqueStatus: PlaqueStatus;
    transportationUnitCaption: string;
    transportationCompanyCaption: string;
    vehicleUserTypeCaption: string;
    vehicleCategoryCaption: string;
    currentDriver: IDriver
}
