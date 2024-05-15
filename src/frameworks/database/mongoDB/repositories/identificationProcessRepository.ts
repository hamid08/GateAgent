import IdentificationProcess from "../models/identificationProcess";


import {
    IdentificationProcessModel,


} from '../../../../application/models/identificationProcessModels';
import { IdentificationProcessFinishReason, IdentificationProcessStatus } from "@/application/enums/gateEnum";

export default function identificationProcessRepository() {

    const addNewProcess = async (processData: IdentificationProcessModel) => {
        const newProcess = new IdentificationProcess(processData);
        return await newProcess.save();
    }


    /**
     * Finish identification process in gate
     * @param gateId - Gate ID
     * @param status - Identification process status
     * @param finishReason - Identification process finish reason
     * @returns Promise<void>
    */
    const finishProcessInGate = async (
        gateId: string,
        status: IdentificationProcessStatus,
        finishReason: IdentificationProcessFinishReason
    ): Promise<void> => {
        try {
            const updateQuery = {
                finishedProcess: true,
                endProcessTime: new Date(),
                finishedReason: finishReason,
                status,
            };

            await IdentificationProcess.updateMany(
                { finishedProcess: false, gateId },
                { $set: updateQuery }
            );
        } catch (error) {
            console.error(`Error updating finished process in gate ${gateId}: ${error}`);
        }
    };


    const getRunProcessByGateId = async (gateId: string): Promise<IdentificationProcessModel | null> => {
        try {
            const process = await IdentificationProcess.findOne({ finishedProcess: false, gateId: gateId });
            if (!process) return null;

            return process;
        } catch (error) {
            console.error(`Error fetching process by gateId ${gateId}: ${error}`);
            return null;
        }
    }

    const checkRuningProcessInGate = async (gateId: string): Promise<boolean> => {

        const currentProcess = await IdentificationProcess.findOne({ finishedProcess: false, gateId: gateId });

        if (currentProcess) return true;

        return false;
    }


    return {

        addNewProcess,
        checkRuningProcessInGate,
        finishProcessInGate,
        getRunProcessByGateId

    }

}