
import {
    VehiclePlaqueType,
    PlaqueStatus

} from '../enums/gateEnum';

import { BaseGridFilterModel } from './baseModels';


export class TrafficGroupGridFilterModel extends BaseGridFilterModel {

    constructor(
        searchTerm: string,
        pageIndex: number = 1,
        pageSize: number = 10,
        fromDate?: Date,
        toDate?: Date,
    ) {
        super(searchTerm, pageIndex, pageSize);
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
    fromDate?: Date;
    toDate?: Date;
}

export class TrafficGroupGridModel {

    constructor(
        trafficGroupCaption: string,
        plaqueNo: string,
        plaqueType: VehiclePlaqueType,
        plaqueStatus: PlaqueStatus,
        rfidTag: string,
        fromDate: Date,
        toDate: Date,
        name: string,
        presenterName: string,
        description: string,
        cardNumber: string,

    ) {

        this.trafficGroupCaption = trafficGroupCaption;
        this.plaqueNo = plaqueNo;
        this.plaqueType = plaqueType;
        this.plaqueStatus = plaqueStatus;
        this.rfidTag = rfidTag;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.name = name;
        this.presenterName = presenterName;
        this.description = description;
        this.cardNumber = cardNumber;

    }
    trafficGroupCaption: string;
    plaqueNo: string;
    plaqueType: VehiclePlaqueType;
    plaqueStatus: PlaqueStatus;
    rfidTag: string;
    fromDate: Date;
    toDate: Date;
    name: string;
    presenterName: string;
    description: string;
    cardNumber: string;

}





export class TrafficGroupModel {

    constructor(
        id: string,
        plaqueNo: string,
        plaqueType: VehiclePlaqueType,
        plaqueStatus: VehiclePlaqueType,
        rfidTag: string,
        gateId: string,
        gateCaption: string,
        presenterName: string,
        trafficGroupCaption: string,
        fromDate: Date,
        toDate: Date,
        description: string,
        name: string,
        cardNumber: string,
        
        ) {

        this.id = id;
        this.plaqueNo = plaqueNo;
        this.plaqueType = plaqueType;
        this.plaqueStatus = plaqueStatus;
        this.rfidTag = rfidTag;
        this.gateId = gateId;
        this.gateCaption = gateCaption;
        this.name = name;
        this.presenterName = presenterName;
        this.trafficGroupCaption = trafficGroupCaption;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.description = description;
        this.cardNumber = cardNumber;

    }
    id: string;
    plaqueNo: string;
    plaqueType: VehiclePlaqueType;
    plaqueStatus: VehiclePlaqueType;
    rfidTag: string;
    gateId: string;
    gateCaption: string;
    name: string;
    presenterName: string;
    trafficGroupCaption: string;
    fromDate: Date;
    toDate: Date;
    description: string;
    cardNumber: string;
}