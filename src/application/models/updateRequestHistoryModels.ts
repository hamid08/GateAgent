

import {
    SyncDataType
} from '../enums/gateEnum';

export class updateRequestHistoryModels {

    constructor(
        type:SyncDataType,
        dateTime: Date,
        ) {

        this.type = type;
        this.dateTime = dateTime;

    }
    type:SyncDataType;
    dateTime: Date;
}