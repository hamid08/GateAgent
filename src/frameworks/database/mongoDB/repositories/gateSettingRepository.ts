
import { GateSetting, IGateServices, IGateSetting } from '../models/gateSetting';

import { GateServiceGridModel, SocketModel } from '../../../../application/models/gateSettingModels';

import { normalizeUrl } from '../../../../application/utils/generators';


import {
    SyncDataType,
    GateServicesType,
    SocketStatus
} from '../../../../application/enums/gateEnum';
import { UpdateWriteOpResult } from 'mongoose';


export default function gateSettingRepository() {

    const testMongoConnection = async (): Promise<boolean> => {

        try {

            await GateSetting.findOne();
            return true;
        } catch (error) {
            return false;

        }


    }


    const initGateSetting = async () => {

        const defaultGateServiceAddress = '';
        const defaultGateIds: string[] = [];
        const defaultGateServices: IGateServices[] = [];


        const setting: IGateSetting = {
            gateServiceAddress: defaultGateServiceAddress,
            gateIds: defaultGateIds,
            gateServices: defaultGateServices
        };

        const existingRecord = await GateSetting.findOne();
        if (!existingRecord) {
            await GateSetting.create(setting);
        }

    }

    const upsertGateServiceAddress = async (gateServiceAddress: string) => {
        await initGateSetting();

        const options = { new: true };
        const result = await GateSetting.findOneAndUpdate(
            {},
            { gateServiceAddress: gateServiceAddress },
            { ...options, sort: { _id: 1 } }
        );


        return result;
    };

    const findGateIdToGateSetting = async (gateId: string): Promise<boolean> => {

        try {
            const existingRecord = await GateSetting.findOne({ gateIds: gateId });
            if (existingRecord) {
                return true; // gateId exists
            } else {
                return false; // gateId does not exist
            }
        } catch (error) {
            return false;
        }
    };

    const addGateId = async (gateId: string) => {
        const result = await GateSetting.updateOne(
            {},
            { $addToSet: { gateIds: gateId } },
            { upsert: true, sort: { _id: 1 } }
        );
        return result;
    };

    const removeGateId = async (gateId: string): Promise<UpdateWriteOpResult> => {
        const result = await GateSetting.updateOne(
            {},
            { $pull: { gateIds: gateId } },
            { sort: { _id: 1 } }
        );
        return result;
    };


    const getSocketConnectInfoByToken = async (token: string): Promise<SocketModel | null> => {
        const gateSetting = await GateSetting.findOne({});
        if (!gateSetting || !gateSetting.gateServices) {
            return null;
        }

        const gateService = gateSetting.gateServices.find(
            (service: IGateServices) => service.token === token
        );

        return new SocketModel(gateService?.type!, gateService?.token!, SocketStatus.Connect);
    };


    const findGateServiceToGateSettingByToken = async (token: string): Promise<boolean> => {
        try {
            const existingRecord = await GateSetting.findOne({
                gateServices: {
                    $elemMatch: {
                        token: token,
                    },
                },
            });
            if (existingRecord) {
                return true; // gate service exists
            } else {
                return false; // gate service does not exist
            }
        } catch (error) {
            return false;
        }
    };


    const findGateServiceToGateSettingByType = async (type: GateServicesType): Promise<boolean> => {
        try {
            const existingRecord = await GateSetting.findOne({
                gateServices: {
                    $elemMatch: {
                        type: type,
                    },
                },
            });
            if (existingRecord) {
                return true; // gate service exists
            } else {
                return false; // gate service does not exist
            }
        } catch (error) {
            return false;
        }
    };


    const addGateService = async (gateService: IGateServices) => {
        const result = await GateSetting.updateOne(
            {},
            { $addToSet: { gateServices: gateService } },
            { sort: { _id: 1 } }
        );
        return result;
    };

    const removeGateServiceByToken = async (token: string) => {
        const result = await GateSetting.updateOne(
            { gateServices: { $elemMatch: { token: token } } },
            { $pull: { gateServices: { token: token } } },
            { sort: { _id: 1 } }

        );
        return result;
    };


    async function getGateServices(): Promise<GateServiceGridModel[] | []> {
        const document = await GateSetting.findOne({});
        if (!document || !document.gateServices) {
            return [];
        }

        return document.gateServices.map(service =>
            new GateServiceGridModel(
                service.type,
                service.token,
                SocketStatus.Disconnect
            ));
    }

    async function getGateIds(): Promise<string[] | []> {
        const document = await GateSetting.findOne({});
        if (!document || !document.gateIds) {
            return [];
        }

        return document.gateIds.map(service => service);
    }


    async function getGateServiceAddress(): Promise<string | ''> {
        const document = await GateSetting.findOne({});
        if (!document || !document.gateServiceAddress) {
            return '';
        }
        return normalizeUrl(document.gateServiceAddress);
    }


    return {
        upsertGateServiceAddress,
        addGateId,
        removeGateId,
        addGateService,
        removeGateServiceByToken,
        initGateSetting,
        testMongoConnection,
        findGateIdToGateSetting,
        findGateServiceToGateSettingByToken,
        getGateServices,
        getGateIds,
        getSocketConnectInfoByToken,
        findGateServiceToGateSettingByType,
        getGateServiceAddress
    }


}
