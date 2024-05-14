
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


    const finishedProcess = async () => {

        try {

            return await identificationProcessRepository().finishedProcess();

        } catch (error) {
            console.log(error);
        }
    }

    const isRunProcess = async (): Promise<boolean> => {

        try {

            return await identificationProcessRepository().isRunProcess();

        } catch (error) {
            console.log(error);
            return false;
        }
    }


    return {
        addNewProcess,
        finishedProcess,
        isRunProcess

    }

}