import { Schema, model } from 'mongoose';

import {
    SyncDataType
} from '../../../../application/enums/gateEnum';

interface IUpdateRequestHistory {
    type:SyncDataType,
    dateTime: Date,
}


const updateRequestHistorySchema = new Schema<IUpdateRequestHistory>({
    type: { type: Number, enum: SyncDataType },
    dateTime: { type: Date, required: true,default: Date.now },
});
   

export const UpdateRequestHistory = model<IUpdateRequestHistory>('UpdateRequestHistory', updateRequestHistorySchema);