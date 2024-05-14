
import {
    TaxiWorkModeOperation,
    IdentifierConnectionStatus,
    GateIdentificationType,
    IdentityResultType,
    IdentityMessageType,
    IdentificationProcessStatus,
    IdentificationProcessTrafficType,
    VehiclePlaqueType,
    OfflineTrafficsType,
    GateIdentificationTestType

} from '../enums/gateEnum';

import { BaseGridFilterModel } from './baseModels';


export class IdentificationProcessGridFilterModel extends BaseGridFilterModel {

    constructor(
        searchTerm: string,
        pageIndex: number = 1,
        pageSize: number = 10,
        dateTime?: Date,
        name?: string,
        status?: IdentificationProcessStatus,
        plaqueNo?: string,
        trafficType?: IdentificationProcessTrafficType,


    ) {
        super(searchTerm, pageIndex, pageSize);

        this.dateTime = dateTime;
        this.name = name;
        this.status = status;
        this.plaqueNo = plaqueNo;
        this.trafficType = trafficType;
    }

    dateTime?: Date;
    name?: string;
    status?: IdentificationProcessStatus;
    plaqueNo?: string;
    trafficType?: IdentificationProcessTrafficType;
}


export class IdentificationProcessGridModel {

    constructor(
        dateTime: Date, // زمان تردد
        name: string, // شناسه / نام
        status: IdentificationProcessStatus, // وضعیت
        plaqueNo: string,
        plaqueType: VehiclePlaqueType,
        hf: boolean,
        rfid: boolean,
        driverFullName: string,
        vehicleType: string,
        trafficType: IdentificationProcessTrafficType,

    ) {

        this.dateTime = dateTime;
        this.name = name;
        this.plaqueNo = plaqueNo;
        this.plaqueType = plaqueType;
        this.status = status;
        this.driverFullName = driverFullName;
        this.vehicleType = vehicleType;
        this.trafficType = trafficType;
        this.hf = hf;
        this.rfid = rfid;

    }

    dateTime: Date;
    name: string;
    status: IdentificationProcessStatus;
    plaqueNo: string;
    plaqueType: VehiclePlaqueType;
    driverFullName: string;
    vehicleType: string;
    trafficType: IdentificationProcessTrafficType;
    hf: boolean;
    rfid: boolean;

}


export class OfflineTrafficsGridFilterModel extends BaseGridFilterModel {

    constructor(
        searchTerm: string,
        pageIndex: number = 1,
        pageSize: number = 10,

        plaqueNo?: string,
        dateTime?: Date,
        tripNumber?: string,


    ) {
        super(searchTerm, pageIndex, pageSize);

        this.plaqueNo = plaqueNo;
        this.dateTime = dateTime;
        this.tripNumber = tripNumber;
    }

    plaqueNo?: string;
    dateTime?: Date;
    tripNumber?: string;
}



export class OfflineTrafficsGridModel {

    constructor(
        dateTime: Date, // زمان تردد
        vehicleIdentity: string, // شناسه خودرو
        status: OfflineTrafficsType, // وضعیت 
        tripNumber: string, // شماره سفر
        plaqueNo: string, // شماره پلاک
        plaqueType: VehiclePlaqueType,
        hf: boolean,
        rfid: boolean,
        driverFullName: string,
        vehicleType: string
    ) {

        this.dateTime = dateTime;
        this.tripNumber = tripNumber;
        this.vehicleIdentity = vehicleIdentity;
        this.status = status;
        this.plaqueNo = plaqueNo;
        this.plaqueType = plaqueType;
        this.driverFullName = driverFullName;
        this.hf = hf;
        this.rfid = rfid;
        this.vehicleType = vehicleType;

    }

    dateTime: Date; // زمان تردد
    vehicleIdentity: string; // شناسه خودرو
    status: OfflineTrafficsType; // وضعیت 
    tripNumber: string; // شماره سفر
    plaqueNo: string; // شماره پلاک
    plaqueType: VehiclePlaqueType;
    hf: boolean;
    rfid: boolean;
    driverFullName: string;
    vehicleType: string

}






export class LivePlaqueImage {

    constructor(
        image: string,
        gateId: string,
        dateTime: Date,

    ) {

        this.image = image;
        this.gateId = gateId;
        this.dateTime = dateTime;

    }

    image: string;
    gateId: string;
    dateTime: Date;

}

export class Operator_IdentityResultBoxInfo_Model {

    constructor(
        name: string,
        vehicleIdentity: string,

    ) {

        this.name = name;
        this.vehicleIdentity = vehicleIdentity;
    }

    name: string;
    vehicleIdentity: string;

}


export class Operator_IdentityResultBox_Model {

    constructor(
        type: IdentityResultType,
        messageType: IdentityMessageType,
        description: string,
        identityInfo?: Operator_IdentityResultBoxInfo_Model,

    ) {

        this.type = type;
        this.messageType = messageType;
        this.description = description;
        this.identityInfo = identityInfo;

    }

    type: IdentityResultType;
    messageType: IdentityMessageType;
    description: string;
    identityInfo?: Operator_IdentityResultBoxInfo_Model;

}



export class Operator_Gate_Model {

    constructor(
        id: string,
        caption: string,
        terminal: string,

    ) {

        this.id = id;
        this.caption = caption;
        this.terminal = terminal;

    }

    id: string;
    caption: string;
    terminal: string;

}



export class StatusConnectionCard {

    constructor(
        type: GateIdentificationType,
        testType: GateIdentificationTestType,
        isRequired: boolean,
        status: IdentifierConnectionStatus,
        intervalTime: number,


    ) {
        this.type = type;
        this.testType = testType;
        this.isRequired = isRequired;
        this.status = status;
        this.intervalTime = intervalTime;

    }

    type: GateIdentificationType;
    testType: GateIdentificationTestType;
    isRequired: boolean;
    status: IdentifierConnectionStatus;
    intervalTime: number;

}

export class Operator_GateDetails_Model {

    constructor(
        identity: string,
        taxiWorkMode: boolean,
        offlineMode: boolean,
        trafficControlWorkMode: boolean,
        rfid: boolean,
        anpr: boolean,
        hf: boolean,
        statusConnectionCard: StatusConnectionCard[],
        taxiOperation?: TaxiWorkModeOperation,

    ) {

        this.identity = identity;
        this.taxiWorkMode = taxiWorkMode;
        this.offlineMode = offlineMode;
        this.trafficControlWorkMode = trafficControlWorkMode;
        this.taxiOperation = taxiOperation;
        this.rfid = rfid;
        this.anpr = anpr;
        this.hf = hf;
        this.statusConnectionCard = statusConnectionCard;

    }

    identity: string;
    taxiWorkMode: boolean;
    offlineMode: boolean;
    trafficControlWorkMode: boolean;
    taxiOperation?: TaxiWorkModeOperation;
    rfid: boolean;
    anpr: boolean;
    hf: boolean;
    statusConnectionCard: StatusConnectionCard[];

}





//Detection State

export class DetectionStateANPRDataModel {

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
        this.name = name;
        this.vehicleIdentity = vehicleIdentity;
        this.plaqueNo = plaqueNo;
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


export class DetectionStateRFIDDataModel {

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
        this.name = name;
        this.vehicleIdentity = vehicleIdentity;
        this.plaqueNo = plaqueNo;
        this.plaqueType = plaqueType;

    }

    gateId: string;
    found: boolean;
    name?: string;
    vehicleIdentity?: string;
    plaqueNo?: string;
    plaqueType?: VehiclePlaqueType;

}

export class DetectionStateHFDataModel {

    constructor(
        gateId: string,
        found: boolean,
        name?: string, // نام راننده یا نام در کنترل تردد
        image?: string,


    ) {

        this.name = name;
        this.gateId = gateId;
        this.name = name;
        this.image = image;
        this.found = found;

    }

    name?: string;
    gateId: string;
    image?: string;
    found: boolean;

}


export class DetectionStateModel {

    constructor(
        hasProcess: boolean,
        needTripNumber: boolean,
        anprData?: DetectionStateANPRDataModel,
        rfidData?: DetectionStateRFIDDataModel,
        hfData?: DetectionStateHFDataModel,
        message?: Operator_IdentityResultBox_Model,


    ) {

        this.anprData = anprData;
        this.rfidData = rfidData;
        this.hfData = hfData;
        this.message = message;
        this.hasProcess = hasProcess;
        this.needTripNumber = needTripNumber;

    }

    hasProcess: boolean;
    needTripNumber: boolean;
    anprData?: DetectionStateANPRDataModel;
    rfidData?: DetectionStateRFIDDataModel;
    hfData?: DetectionStateHFDataModel;
    message?: Operator_IdentityResultBox_Model;

}