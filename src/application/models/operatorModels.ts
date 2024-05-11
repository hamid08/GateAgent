
import {
    TaxiWorkModeOperation,
    IdentifierConnectionStatus,
    GateIdentificationType

} from '../enums/gateEnum';


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
        intervalTime: number,
        items: StatusConnectionCardItems[],


    ) {
        this.type = type;
        this.intervalTime = intervalTime;
        this.items = items;

    }

    type: GateIdentificationType;
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