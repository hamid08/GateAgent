
import identificationProcessRepository from '../../frameworks/database/mongoDB/repositories/identificationProcessRepository';

import {
    IdentificationProcessModel

} from '../models/identificationProcessModels';

export default function identificationProcessService() {



    const addNewProcess = async (processData: IdentificationProcessModel) => {

        try {

            return await identificationProcessRepository().addNewProcess(processData);

        } catch (error) {
            console.log(error);
        }
    }


    const finishAllProcess = async (): Promise<void> => await identificationProcessRepository().finishAllProcess();
    const finishProcessInGate = async (gateId:string): Promise<void> => await identificationProcessRepository().finishProcessInGate(gateId);


    const checkRuningProcessInGate = async (gateId:string): Promise<boolean> => {

        try {

            return await identificationProcessRepository().checkRuningProcessInGate(gateId);

        } catch (error) {
            console.log(error);
            return false;
        }
    }


    return {
        addNewProcess,
        finishAllProcess,
        checkRuningProcessInGate,
        finishProcessInGate
    }

}