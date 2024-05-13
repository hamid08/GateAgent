
import {
    TaxiWorkModeOperation,
    IdentifierConnectionStatus,
    GateIdentificationType,
    IdentityResultType,
    IdentityMessageType,
    IdentificationProcessStatus,
    IdentificationProcessTrafficType,
    VehiclePlaqueType,
    OfflineTrafficsType

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
        identityInfo: Operator_IdentityResultBoxInfo_Model,

    ) {

        this.type = type;
        this.messageType = messageType;
        this.description = description;
        this.identityInfo = identityInfo;

    }

    type: IdentityResultType;
    messageType: IdentityMessageType;
    description: string;
    identityInfo: Operator_IdentityResultBoxInfo_Model;

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


export class StatusConnectionCardItemTooltipInfo {

    constructor(
        intervalTime: number,
        ip?: string,
        port?: number,

    ) {

        this.ip = ip;
        this.port = port;
        this.intervalTime = intervalTime;

    }

    ip?: string;
    port?: number;
    intervalTime: number;

}

export class StatusConnectionCardItems {

    constructor(
        caption: string,
        status: IdentifierConnectionStatus,
        toolTipInfo?: StatusConnectionCardItemTooltipInfo,


    ) {

        this.caption = caption;
        this.status = status;
        this.toolTipInfo = toolTipInfo;

    }

    caption: string;
    status: IdentifierConnectionStatus;
    toolTipInfo?: StatusConnectionCardItemTooltipInfo;

}


export class StatusConnectionCard {

    constructor(
        type: GateIdentificationType,
        status: IdentifierConnectionStatus,
        intervalTime: number,
        items: StatusConnectionCardItems[],


    ) {
        this.type = type;
        this.status = status;
        this.intervalTime = intervalTime;
        this.items = items;

    }

    type: GateIdentificationType;
    status: IdentifierConnectionStatus;
    intervalTime: number;
    items: StatusConnectionCardItems[];

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
        rfidStatus: IdentifierConnectionStatus,
        anprStatus: IdentifierConnectionStatus,
        hfStatus: IdentifierConnectionStatus,
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
        this.rfidStatus = rfidStatus;
        this.anprStatus = anprStatus;
        this.hfStatus = hfStatus;
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
    rfidStatus: IdentifierConnectionStatus;
    anprStatus: IdentifierConnectionStatus;
    hfStatus: IdentifierConnectionStatus;
    statusConnectionCard: StatusConnectionCard[];

}