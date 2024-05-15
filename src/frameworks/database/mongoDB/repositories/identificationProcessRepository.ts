import { IdentificationProcess } from "../models/identificationProcess";


import {
    IdentificationProcessModel,


} from '../../../../application/models/identificationProcessModels';

export default function identificationProcessRepository() {

    const addNewProcess = async (processData: IdentificationProcessModel) => {
        const newProcess = new IdentificationProcess(processData);
        return await newProcess.save();
    }


    
    const finishAllProcess = async (): Promise<void> => {
        try {
            await IdentificationProcess.updateMany({ finishedProcess: false }, { $set: { finishedProcess: true } });
        } catch (error) {
            console.error(`Error updating finished all processe gates : ${error}`);
        }
    };

    const finishProcessInGate = async (gateId:string): Promise<void> => {
        try {
            await IdentificationProcess.updateMany({ finishedProcess: false,gateId:gateId }, { $set: { finishedProcess: true } });
        } catch (error) {
            console.error(`Error updating finished processe in gate ${gateId}: ${error}`);
        }
    };


    const checkRuningProcessInGate = async (gateId:string): Promise<boolean> => {

        const currentProcess = await IdentificationProcess.findOne({ finishedProcess: false,gateId:gateId });

        if (currentProcess) return true;

        return false;
    }


    return {

        addNewProcess,
        finishAllProcess,
        checkRuningProcessInGate,
        finishProcessInGate

    }

}