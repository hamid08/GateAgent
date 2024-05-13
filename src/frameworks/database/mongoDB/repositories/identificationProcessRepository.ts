import { IdentificationProcess } from "../models/identificationProcess";


import {
    IdentificationProcessModel,


} from '../../../../application/models/identificationProcessModels';

export default function identificationProcessRepository() {

    const addNewProcess = async (processData: IdentificationProcessModel) => {
        const newProcess = new IdentificationProcess(processData);
        return await newProcess.save();
    }

    const finishedProcess = async () => {

        const currentProcess = await IdentificationProcess.findOne({ finishedProcess: false });

        if (currentProcess) {

            currentProcess.finishedProcess = true;

            return currentProcess.save();

        }
    }

    const isRunProcess = async (): Promise<boolean> => {

        const currentProcess = await IdentificationProcess.findOne({ finishedProcess: false });

        if (currentProcess) return true;

        return false;
    }


    return {

        addNewProcess,
        finishedProcess,
        isRunProcess

    }

}