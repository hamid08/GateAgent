
import { UpdateRequestHistory } from '../models/updateRequestHistory';

import { updateRequestHistoryModels } from '../../../../application/models/updateRequestHistoryModels';


import {
    SyncDataType
} from '../../../../application/enums/gateEnum';


export default function updateRequestHistoryRepository() {

    async function GetList(type?: SyncDataType): Promise<updateRequestHistoryModels[]> {
        const documents = type ? await UpdateRequestHistory.find({ type }) : await UpdateRequestHistory.find({});
        return documents.map(document => new updateRequestHistoryModels(document.type, document.dateTime));
    }



    return {
        GetList,
    }


}
