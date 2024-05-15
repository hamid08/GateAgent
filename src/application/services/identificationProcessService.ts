
import identificationProcessRepository from '../../frameworks/database/mongoDB/repositories/identificationProcessRepository';

import {
    IdentificationProcessModel

} from '../models/identificationProcessModels';

import identificationProcessRedisRepository from '../../frameworks/database/redis/identificationProcessRedisRepository';
import { IdentificationProcessFinishReason, IdentificationProcessStatus } from '../enums/gateEnum';

import gateService from './gateService';

export default function identificationProcessService() {

    var _redisRepository = identificationProcessRedisRepository();

    const addNewProcess = async (processData: IdentificationProcessModel) => {

        try {

            return await identificationProcessRepository().addNewProcess(processData);

        } catch (error) {
            console.log(error);
        }
    }


    const finishAllProcess = async (): Promise<void> => {

        try {
            var gateIds = await gateService().getGateIds();
            if (gateIds) {

                gateIds.forEach(async c => {

                    await finishProcessInGate(c,IdentificationProcessStatus.UnSuccessful,IdentificationProcessFinishReason.CancelByGateSystem);
                });


            }
        } catch (error) {
            console.log(`Can Not FinishAllProcess: ${error}`);
        }

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
            await identificationProcessRepository().finishProcessInGate(gateId, status, finishReason);

            await _redisRepository.delANPR(gateId);
            await _redisRepository.delHF(gateId);
            await _redisRepository.delRFID(gateId);

            await _redisRepository.setTemporaryLockProcess(gateId);

        } catch (error) {
            console.log(`Can Not FinishProcess By GateId: ${gateId} => ${error}`);
        }


    }


    const checkRuningProcessInGate = async (gateId: string): Promise<boolean> => {

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