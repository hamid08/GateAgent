
import {

    IdentificationProcessFinishReason,
    IdentificationProcessStatus,
    IdentificationProcessTrafficType,
    VehiclePlaqueType

} from '../enums/gateEnum';



export interface IdentificationProcessModel {
    gateId: string;
    startProcessTime: Date;
    endProcessTime?: Date;
    status: IdentificationProcessStatus; // وضعیت
    finishedProcess: boolean;
    name: string; // شناسه / نام
    hf: boolean;
    anpr: boolean;
    rfid: boolean;
    trafficType: IdentificationProcessTrafficType; // نوع تردد
    permissionTrafficGroupId?: string; // شناسه کنترل ترددی
    vehicleId?: string; // شناسه خودرو
    driverId?: string;

    driverFullName?: string;

    plaqueNo?: string;
    plaqueType?: VehiclePlaqueType;
    vehicleType?: string;

    finishedReason?: IdentificationProcessFinishReason

}


export class RFIDPureDataModel {

    constructor(tag: string, rfidAntennaId: string, gateId: string, dateTime: Date) {
        this.Tag = tag;
        this.RFIDAntennaId = rfidAntennaId;
        this.GateId = gateId;
        this.DateTime = dateTime;
    }

    Tag: string;
    RFIDAntennaId: string;
    GateId: string;
    DateTime: Date;

}


export class RFIDDetectedDataModel {

    constructor(
        trafficType: IdentificationProcessTrafficType,

        plaqueNo?: string,
        plaqueType?: VehiclePlaqueType,


        //Traffic Control
        permissionTrafficGroupId?: string,
        name?: string,


        //Taxi
        vehicleId?: string,
        vehicleIdentity?: string,
        vehicleType?: string,

    ) {


        this.trafficType = trafficType;
        this.plaqueNo = plaqueNo;
        this.plaqueType = plaqueType;
        this.permissionTrafficGroupId = permissionTrafficGroupId;
        this.name = name;
        this.vehicleId = vehicleId;
        this.vehicleIdentity = vehicleIdentity;
        this.vehicleType = vehicleType;
    }

    trafficType: IdentificationProcessTrafficType;

    plaqueNo?: string;
    plaqueType?: VehiclePlaqueType;


    permissionTrafficGroupId?: string;
    name?: string;


    vehicleId?: string;
    vehicleIdentity?: string;
    vehicleType?: string;

}


export class RFIDCacheDataModel {

    constructor(
        pureData: RFIDPureDataModel,
        detected: boolean,
        detectedData?: RFIDDetectedDataModel,

    ) {

        this.pureData = pureData;
        this.detected = detected;
        this.pureData = pureData;

    }

    pureData: RFIDPureDataModel;
    detected: boolean;
    detectedData?: RFIDDetectedDataModel;

}

export class RFIDDataSocketModel {

    constructor(
        gateId: string,
        found: boolean,
        name?: string,
        vehicleIdentity?: string,
        plaqueNo?: string,
        plaqueType?: VehiclePlaqueType,



    ) {

        this.gateId = gateId;
        this.found = found;
        this.name = name ?? '';
        this.vehicleIdentity = vehicleIdentity ?? '';
        this.plaqueNo = plaqueNo ?? '';
        this.plaqueType = plaqueType;

    }

    gateId: string;
    found: boolean;
    name?: string;
    vehicleIdentity?: string;
    plaqueNo?: string;
    plaqueType?: VehiclePlaqueType;

}



export class ANPRPureDataModel {

    constructor(plate: string, cameraId: string, gateId: string, dateTime: Date) {
        this.Plate = plate;
        this.CameraId = cameraId;
        this.GateId = gateId;
        this.DateTime = dateTime;
    }

    Plate: string;
    CameraId: string;
    GateId: string;
    DateTime: Date;

}

export class ANPRDetectedDataModel {

    constructor(
        trafficType: IdentificationProcessTrafficType,

        plaqueNo?: string,
        plaqueType?: VehiclePlaqueType,


        //Traffic Control
        permissionTrafficGroupId?: string,
        name?: string,


        //Taxi
        vehicleId?: string,
        vehicleIdentity?: string,
        vehicleType?: string,

    ) {


        this.trafficType = trafficType;
        this.plaqueNo = plaqueNo;
        this.plaqueType = plaqueType;
        this.permissionTrafficGroupId = permissionTrafficGroupId;
        this.name = name;
        this.vehicleId = vehicleId;
        this.vehicleIdentity = vehicleIdentity;
        this.vehicleType = vehicleType;
    }

    trafficType: IdentificationProcessTrafficType;

    plaqueNo?: string;
    plaqueType?: VehiclePlaqueType;


    permissionTrafficGroupId?: string;
    name?: string;


    vehicleId?: string;
    vehicleIdentity?: string;
    vehicleType?: string;

}

export class ANPRCacheDataModel {

    constructor(
        pureData: ANPRPureDataModel,
        detected: boolean,
        detectedData?: ANPRDetectedDataModel,

    ) {

        this.pureData = pureData;
        this.detected = detected;
        this.pureData = pureData;

    }

    pureData: ANPRPureDataModel;
    detected: boolean;
    detectedData?: ANPRDetectedDataModel;

}

export class ANPRDataSocketModel {

    constructor(
        gateId: string,
        found: boolean,
        dateTime: Date,
        image: string,
        name?: string,
        vehicleIdentity?: string,
        plaqueNo?: string,
        plaqueType?: VehiclePlaqueType,



    ) {

        this.gateId = gateId;
        this.found = found;
        this.dateTime = dateTime;
        this.image = image;
        this.name = name ?? '';
        this.vehicleIdentity = vehicleIdentity ?? '';
        this.plaqueNo = plaqueNo ?? '';
        this.plaqueType = plaqueType;

    }

    gateId: string;
    found: boolean;
    dateTime: Date;
    image: string;
    name?: string;
    vehicleIdentity?: string;
    plaqueNo?: string;
    plaqueType?: VehiclePlaqueType;

}







export class HFPureDataModel {

    constructor(cardNo: string, gateId: string, dateTime: Date) {
        this.cardNo = cardNo;
        this.gateId = gateId;
        this.dateTime = dateTime;
    }

    cardNo: string;
    gateId: string;
    dateTime: Date;

}


export class HFDetectedDataModel {

    constructor(
        trafficType: IdentificationProcessTrafficType,


        //Traffic Control
        permissionTrafficGroupId?: string,
        name?: string,


        //Taxi
        driverId?: string,
        nationalNo?: string,
        driverFullName?: string,
        driverAvatar?: string,

    ) {


        this.trafficType = trafficType;
        this.permissionTrafficGroupId = permissionTrafficGroupId;
        this.name = name;
        this.driverId = driverId;
        this.nationalNo = nationalNo;
        this.driverFullName = driverFullName;
        this.driverAvatar = driverAvatar;
    }

    trafficType: IdentificationProcessTrafficType;

    permissionTrafficGroupId?: string;
    name?: string;


    driverId?: string;
    nationalNo?: string;
    driverFullName?: string;
    driverAvatar?: string;

}

export class HFCacheDataModel {

    constructor(
        pureData: HFPureDataModel,
        detected: boolean,
        detectedData?: HFDetectedDataModel,

    ) {

        this.pureData = pureData;
        this.detected = detected;
        this.pureData = pureData;

    }

    pureData: HFPureDataModel;
    detected: boolean;
    detectedData?: HFDetectedDataModel;

}


export class HFDataSocketModel {

    constructor(
        gateId: string,
        found: boolean,
        name?: string, // نام راننده یا نام در کنترل تردد
        image?: string,


    ) {

        this.name = name;
        this.gateId = gateId;
        this.name = name ?? '';
        this.image = image ?? '';
        this.found = found;

    }

    name?: string;
    gateId: string;
    image?: string;
    found: boolean;

}
