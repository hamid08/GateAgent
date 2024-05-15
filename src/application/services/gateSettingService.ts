
import gateSettingRepository from '../../frameworks/database/mongoDB/repositories/gateSettingRepository';
import redisRepository from '../../frameworks/database/redis/gateRepository';
import updateRequestHistoryRepository from '../../frameworks/database/mongoDB/repositories/updateRequestHistoryRepository';

import { IGateServices } from '../../frameworks/database/mongoDB/models/gateSetting';
import { updateRequestHistoryModels } from '../models/updateRequestHistoryModels';
import { GateServiceGridModel, BasicConfigModel, SyncDataModel } from '../models/gateSettingModels';

import httpsAgent from '../../config/axiosConfig';
import axios from 'axios';

import { SmartGateModel, SmartGateGridModel, SmartGateDetailsModel } from '../models/smartGateModels';
import { TrafficGroupGridFilterModel, TrafficGroupGridModel } from '../models/trafficGroupModels';
import { GridResultModel } from '../models/baseModels';

import config from '../../config/config';
import mongoRepository from '../../frameworks/database/mongoDB/repositories/gateRepository';

import { generateToken, isValidUrl, normalizeUrl } from '../utils/generators';

import { getConnectedSocket } from '../../frameworks/services/socket/connection';


import {
    SyncDataType,
    GateServicesType,
    SocketStatus,
    BasicConfigType
} from '../enums/gateEnum';

export default function gateService() {

    const axiosInstance = axios.create({
        httpsAgent
    });

    async function getGateServiceAddress(): Promise<string | ''> {

        try {
            return await gateSettingRepository().getGateServiceAddress();

        } catch (error) {

        }

        return '';
    }


    const initGateSetting = async () => {

        try {
            await gateSettingRepository().initGateSetting();
        } catch (error) {
            console.error(error);
        }

    }


    const getBasicConfig = async (): Promise<BasicConfigModel[] | null> => {
        try {
            const result: BasicConfigModel[] = [];

            // GateService
            result.push(
                new BasicConfigModel(BasicConfigType.GateService, await getGateServiceAddress(), true, true)
            );

            //MongoDb
            result.push(
                new BasicConfigModel(BasicConfigType.MongoDb, config.mongo.uri, false, true)
            );

            //Redis
            result.push(
                new BasicConfigModel(BasicConfigType.Redis, config.redis.uri, false, true)
            );

            return result;
        } catch (error) {
            console.error('Error in getBasicConfig:', error);
            return null;
        }
    };

    const editBasicConfig = async (basicConfigType: BasicConfigType, value: string) => {

        switch (basicConfigType) {

            case BasicConfigType.GateService:
                await upsertGateServiceAddress(value);
                break;

            case BasicConfigType.MongoDb:

                // ویرایش نداریم
                break;

            case BasicConfigType.Redis:
                // ویرایش نداریم
                break;
        }
    };


    const testBasicConfig = async (basicConfigType: BasicConfigType, value: string) => {

        var testResult: boolean = false;

        switch (basicConfigType) {

            case BasicConfigType.GateService:
                if (!value)
                    throw new Error('مقدار برای تست الزامی می باشد');

                testResult = await testGateServiceAddress(value);

                break;

            case BasicConfigType.MongoDb:
                testResult = await testMongoConnection();
                break;

            case BasicConfigType.Redis:
                testResult = await testRedisConnection();
                break;
            default:
                throw new Error('نوع درخواستی معتبر نمی باشد');
        }

        if (!testResult) throw new Error();

    };





    const upsertGateServiceAddress = async (gateServiceAddress: string) => {

        if (!gateServiceAddress) {
            throw new Error('آدرس معتبر نمی باشد');
        }

        if (!isValidUrl(gateServiceAddress)) {
            throw new Error('آدرس معتبر نمی باشد');
        }

        await gateSettingRepository().upsertGateServiceAddress(gateServiceAddress);

    };

    async function getSmartGate(gateId: string): Promise<SmartGateModel[]> {

        var result: any;

        var gateIds = `gateIds=${gateId}`;
        var gateServiceAddress = await getGateServiceAddress();



        await axiosInstance.get(`${gateServiceAddress}${config.common.smartGates_endPoint}?${gateIds}`)
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.error(`Error: Cannot Connect To GateService Address!`,
                    error.message);
                throw new Error("ارتباط با سرور گیت بدرستی برقرار نشد");

            });

        return result;
    }

    const addGateId = async (gateId: string) => {
        if (!await gateSettingRepository().findGateIdToGateSetting(gateId)) {

            var smartGates = await getSmartGate(gateId);
            if (smartGates.length == 0 || smartGates == null) throw new Error("شناسه گیت معتبر نمی باشد");

            await mongoRepository().addRangeSmartGate(smartGates);

            await gateSettingRepository().addGateId(gateId);
        }
        else {
            throw new Error("شناسه گیت تکراری می باشد");
        }

    };

    const removeGateId = async (gateId: string) => {

        const removeResult = await gateSettingRepository().removeGateId(gateId);

        if (removeResult.modifiedCount != 1) {
            throw new Error("شناسه گیت معتبر نمی باشد");
        }

        var smartGateRemoveResult = await mongoRepository().removeSmartGateByIdentity(gateId);


        var trafficGroupsRemoveResult = await mongoRepository().removeTrafficGroupByGateId(gateId);


    };


    const generateTokenNew = async (): Promise<string> => {
        var token = generateToken();
        while (await gateSettingRepository().findGateServiceToGateSettingByToken(token)) {
            token = generateToken();
        }

        return token;

    }

    const addGateService = async (type: GateServicesType) => {

        if (type == GateServicesType.GateWeb && await gateSettingRepository().findGateServiceToGateSettingByType(type)) {
            throw new Error("برای این نوع سرویس حداکثر یک توکن می توان ایجاد کرد");
        }

        var gateService: IGateServices = {
            token: await generateTokenNew(),
            type: type

        };

        await gateSettingRepository().addGateService(gateService);

    };

    const removeGateServiceByToken = async (token: string) => {

        var removeResult = await gateSettingRepository().removeGateServiceByToken(token);
        if (removeResult.modifiedCount != 1) {
            throw new Error("توکن سرویس معتبر نمی باشد");
        }

    };


    const getSyncData = async (type?: SyncDataType): Promise<SyncDataModel[] | null> => {

        try {
            const result: SyncDataModel[] = [];

            if (type) {

                var historyResult = await updateRequestHistoryRepository().GetList(type);
                var historyDateTime = historyResult ? historyResult[0].dateTime : undefined;
                var isAlert = type == (SyncDataType.RFIDListenerUpdateAlert | SyncDataType.ANPRListenerUpdateAlert);


                // Type
                result.push(
                    new SyncDataModel(type, historyDateTime, isAlert)
                );

            }

            else {

                var historiesResult = await updateRequestHistoryRepository().GetList();

                // Vehicles
                result.push(
                    new SyncDataModel(SyncDataType.Vehicles, historiesResult.find(c => c.type == SyncDataType.Vehicles)?.dateTime)
                );

                // Gates
                result.push(
                    new SyncDataModel(SyncDataType.Gates, historiesResult.find(c => c.type == SyncDataType.Gates)?.dateTime)
                );

                // RFIDListenerUpdateAlert
                result.push(
                    new SyncDataModel(SyncDataType.RFIDListenerUpdateAlert, historiesResult.find(c => c.type == SyncDataType.RFIDListenerUpdateAlert)?.dateTime, true)
                );

                // ANPRListenerUpdateAlert
                result.push(
                    new SyncDataModel(SyncDataType.ANPRListenerUpdateAlert, historiesResult.find(c => c.type == SyncDataType.ANPRListenerUpdateAlert)?.dateTime, true)
                );

                // TrafficGroups
                result.push(
                    new SyncDataModel(SyncDataType.TrafficGroups, historiesResult.find(c => c.type == SyncDataType.TrafficGroups)?.dateTime)
                );

                // SmartGateUsers
                result.push(
                    new SyncDataModel(SyncDataType.SmartGateUsers, historiesResult.find(c => c.type == SyncDataType.SmartGateUsers)?.dateTime)
                );


            }


            return result;
        } catch (error) {
            console.error(error);
            return null;
        }


    };



    const testGateServiceAddress = async (gateServiceAddress: string): Promise<boolean> => {
        try {

            var result = false;

            var validGateServiceAddress = normalizeUrl(gateServiceAddress);

            await axiosInstance.get(`${validGateServiceAddress}${config.common.gateServiceHealth}`)
                .then(response => {
                    if (response.data) {
                        result = true;
                    }
                })
                .catch(error => {
                    console.error(`Error: Cannot Connect To GateService Address!`,
                        error.message);
                });

        } catch (error) {
            console.error(error)
            result = false;

        }

        return result;
    };

    const testMongoConnection = async (): Promise<boolean> => {

        return await gateSettingRepository().testMongoConnection();
    }

    const testRedisConnection = async (): Promise<boolean> => {

        return await redisRepository().testRedisConnection();
    }

    const getSmartGates = async (): Promise<SmartGateGridModel[]> => {
        try {
            return await mongoRepository().getSmartGates();
        } catch (error) {
            console.error(error)
            throw new Error();

        }
    };


    const getSmartGateById = async (gateId: string): Promise<SmartGateDetailsModel | null> => {
        try {
            return await mongoRepository().getSmartGateById(gateId);
        } catch (error) {
            console.error(error)
            throw new Error();

        }
    };


    const getTrafficGroupsByGateId = async (gateId: string, filterModel: TrafficGroupGridFilterModel)
        : Promise<GridResultModel> => {
        try {
            return await mongoRepository().getTrafficGroupsByGateId(gateId, filterModel);

        } catch (error) {
            console.error(error)
            throw new Error();

        }
    };


    async function getGateServices(): Promise<GateServiceGridModel[] | []> {

        var gateServices = await gateSettingRepository().getGateServices();

        var sockets = getConnectedSocket();

        if (!sockets && sockets == null) return gateServices;

        gateServices.forEach(c => {

            var socketInfo = sockets?.find(x => x.token == c.token);
            if (socketInfo) {
                c.socketStatus = SocketStatus.Connect;
            }

        });



        return gateServices;

    }



    return {
        upsertGateServiceAddress,
        addGateId,
        removeGateId,
        addGateService,
        removeGateServiceByToken,
        getSyncData,
        initGateSetting,
        testGateServiceAddress,
        testMongoConnection,
        testRedisConnection,

        getSmartGates,
        getSmartGateById,
        getTrafficGroupsByGateId,
        getGateServices,
        getGateServiceAddress,
        editBasicConfig,
        testBasicConfig,
        getBasicConfig
    }
}