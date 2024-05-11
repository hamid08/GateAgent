
import { Socket } from 'socket.io';
import {
GateServicesType,
SocketStatus,
BasicConfigType,
SyncDataType
} from '../enums/gateEnum';


export class BasicConfigModel{
    constructor(
        basicConfigType: BasicConfigType,
        address: string,
        hasEdit: Boolean,
        hasTest:Boolean
    ) {

        this.basicConfigType = basicConfigType;
        this.address = address;
        this.hasEdit = hasEdit;
        this.hasTest = hasTest;

    }
   
    basicConfigType: BasicConfigType;
    address: string;
    hasEdit: Boolean;
    hasTest:Boolean;
}




export class SocketModel{
    constructor(
        type: GateServicesType,
        token: string,
        socketStatus: SocketStatus,
        socket?:Socket
    ) {

        this.type = type;
        this.token = token;
        this.socketStatus = socketStatus;
        this.socket = socket;

    }
    type: GateServicesType;
    token: string;
    socketStatus: SocketStatus;
    socket?:Socket;
}

export class GateServiceGridModel {

    constructor(
        type: GateServicesType,
        token: string,
        socketStatus: SocketStatus,
    ) {

        this.type = type;
        this.token = token;
        this.socketStatus = socketStatus;

    }
    type: GateServicesType;
    token: string;
    socketStatus: SocketStatus;
}


export class SyncDataModel {

    constructor(
        type:SyncDataType,
        dateTime?: Date,
        isAlert: boolean = false,
        ) {

        this.type = type;
        this.dateTime = dateTime;
        this.isAlert = isAlert;

    }
    type:SyncDataType;
    dateTime?: Date;
    isAlert: boolean = false;
}