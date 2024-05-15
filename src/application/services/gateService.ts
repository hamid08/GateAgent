import { DriverModel, VehicleModel } from '../models/vehicleModels';
import { SmartGateModel } from '../models/smartGateModels';
import { TrafficGroupModel } from '../models/trafficGroupModels';
import { UserModel } from '../models/userModels';
import httpsAgent from '../../config/axiosConfig';
import axios from 'axios';
import mongoRepository from '../../frameworks/database/mongoDB/repositories/gateRepository';
import gateSettingRepository from '../../frameworks/database/mongoDB/repositories/gateSettingRepository';
import config from '../../config/config';
import { AnprCameraModel, RfidAntennaModel } from '../models/smartGateModels';
import { upsertAlertToANPRListener, upsertAlertToRFIDListener } from '../../frameworks/services/socket/connection';


import {
    SyncDataType
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

    async function getGateIds(): Promise<string[] | []> {

        return await gateSettingRepository().getGateIds();
    }

    async function getGateIdsQueryString(): Promise<string> {
        var gateIdsStr = '';

        var gateIds = await gateSettingRepository().getGateIds();
        try {
            gateIds.forEach((gateId) => {
                if (gateIdsStr == '')
                    gateIdsStr += `gateIds=${gateId}`;
                else
                    gateIdsStr += `&gateIds=${gateId}`;

            });
        } catch (error) {

        }

        return gateIdsStr;
    }

    // Vehicles

    async function syncVehicles(): Promise<boolean> {
        try {

            var pageNumber = 1;
            while (true) {
                var vehicles = await getVehicles(pageNumber);
                if (vehicles.length) {
                    await upsertVehicles(vehicles);
                    pageNumber++;
                }
                else
                    break;
            }

            //Upsert HistoryUpdateRequest
            await mongoRepository().upsertHistoryUpdateRequest(SyncDataType.Vehicles);


        } catch (error) {
            console.error(error);
            return false;
        }

        return true;

    }

    async function upsertVehicles(vehicles: VehicleModel[]) {
        try {
            await mongoRepository().addRange(vehicles);

        } catch (error) {
            console.error(error);
        }
    }

    async function getVehicles(pageNumber: Number): Promise<VehicleModel[]> {

        var result: any;

        var pageSize = 10;

        var parameters = await getGateIdsQueryString();
        var gateServiceAddress = await getGateServiceAddress();

        if (parameters != '' && parameters != undefined && parameters != null) {
            await axiosInstance.get(`${gateServiceAddress}${config.common.vehicles_endPoint}?${parameters}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
                .then(response => {
                    result = response.data;
                })
                .catch(error => {
                    console.error(`Error: Cannot Connect To GateService Address!`,
                        error.message);
                });
        }

        return result;
    }

    // Traffic Group

    async function syncTrafficGroups(): Promise<boolean> {
        try {

            var pageNumber = 1;
            while (true) {
                var trafficGroups = await getTrafficGroups(pageNumber);
                if (trafficGroups.length) {
                    await upsertTrafficGroups(trafficGroups);
                    pageNumber++;
                }
                else
                    break;
            }

            //Upsert HistoryUpdateRequest
            await mongoRepository().upsertHistoryUpdateRequest(SyncDataType.TrafficGroups);


        } catch (error) {
            console.error(error);
            return false;
        }

        return true;

    }

    async function upsertTrafficGroups(trafficGroups: TrafficGroupModel[]) {
        try {
            await mongoRepository().addRangeTrafficGroup(trafficGroups);

        } catch (error) {
            console.error(error);
        }
    }

    async function getTrafficGroups(pageNumber: Number): Promise<TrafficGroupModel[]> {

        var result: any;

        var pageSize = 10;
        var parameters = await getGateIdsQueryString();
        var gateServiceAddress = await getGateServiceAddress();

        if (parameters != '' && parameters != undefined && parameters != null) {

            await axiosInstance.get(`${gateServiceAddress}${config.common.trafficGroups_endPoint}?${parameters}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
                .then(response => {
                    result = response.data;
                })
                .catch(error => {
                    console.error(`Error: Cannot Connect To GateService Address!`,
                        error.message);
                });
        }
        return result;
    }


    // Smart Gate User

    async function syncSmartGateUsers(): Promise<boolean> {
        try {

            var pageNumber = 1;
            while (true) {
                var smartGateUsers = await getSmartGateUsers(pageNumber);
                if (smartGateUsers.length) {
                    await upsertSmartGateUsers(smartGateUsers);
                    pageNumber++;
                }
                else
                    break;
            }

            //Upsert HistoryUpdateRequest
            await mongoRepository().upsertHistoryUpdateRequest(SyncDataType.SmartGateUsers);


        } catch (error) {
            console.error(error);
            return false;
        }

        return true;

    }

    async function upsertSmartGateUsers(smartGateUsers: UserModel[]) {
        try {
            await mongoRepository().addRangeSmartGateUsers(smartGateUsers);

        } catch (error) {
            console.error(error);
        }
    }

    async function getSmartGateUsers(pageNumber: Number): Promise<UserModel[]> {

        var result: any;

        var pageSize = 10;
        var parameters = await getGateIdsQueryString();
        var gateServiceAddress = await getGateServiceAddress();

        if (parameters != '' && parameters != undefined && parameters != null) {

            await axiosInstance.get(`${gateServiceAddress}${config.common.smartGateUsers_endPoint}?${parameters}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
                .then(response => {
                    result = response.data;
                })
                .catch(error => {
                    console.error(`Error: Cannot Connect To GateService Address!`,
                        error.message);
                });
        }
        return result;
    }




    // Smart Gate

    async function syncSmartGates(): Promise<boolean> {
        try {
            var smartGates = await getSmartGates();
            if (!smartGates) return false;
            await upsertSmartGates(smartGates);

            //Upsert HistoryUpdateRequest
            await mongoRepository().upsertHistoryUpdateRequest(SyncDataType.Gates);


        } catch (error) {
            console.error(error);
            return false;
        }

        return true;

    }

    async function upsertSmartGates(smartGates: SmartGateModel[]) {
        try {
            await mongoRepository().addRangeSmartGate(smartGates);

        } catch (error) {
            console.error(error);
        }
    }

    async function getSmartGates(): Promise<SmartGateModel[]> {

        var result: any;

        var parameters = await getGateIdsQueryString();
        var gateServiceAddress = await getGateServiceAddress();

        if (parameters != '' && parameters != undefined && parameters != null) {
            await axiosInstance.get(`${gateServiceAddress}${config.common.smartGates_endPoint}?${parameters}`)
                .then(response => {
                    result = response.data;
                })
                .catch(error => {
                    console.error(`Error: Cannot Connect To GateService Address!`,
                        error.message);
                });

        }

        return result;
    }


    // Anpr Listener
    async function gateCameras(): Promise<AnprCameraModel[]> {

        return await mongoRepository().gateCameras();
    }

    // Rfid Camera
    async function gateRfidAntennas(): Promise<RfidAntennaModel[]> {

        return await mongoRepository().gateRfidAntennas();
    }



    // Common Function

    const upsertHistoryUpdateRequest = async (type: SyncDataType) => {
        await mongoRepository().upsertHistoryUpdateRequest(type);
    };

    const sendSyncDataRequest = async (type: SyncDataType) => {

        switch (type) {

            case SyncDataType.RFIDListenerUpdateAlert:
                await upsertAlertToRFIDListener();

                await upsertHistoryUpdateRequest(SyncDataType.RFIDListenerUpdateAlert)

                break;

            case SyncDataType.ANPRListenerUpdateAlert:

                await upsertAlertToANPRListener();
                await upsertHistoryUpdateRequest(SyncDataType.ANPRListenerUpdateAlert)

                break;

            case SyncDataType.Vehicles:

                var result: boolean = await syncVehicles();
                if (!result) throw new Error('ارتباط با سرور به درستی برقرار نشد');

                break;

            case SyncDataType.TrafficGroups:

                var result: boolean = await syncTrafficGroups();
                if (!result) throw new Error('ارتباط با سرور به درستی برقرار نشد');

                break;

            case SyncDataType.SmartGateUsers:

                var result: boolean = await syncSmartGateUsers();
                if (!result) throw new Error('ارتباط با سرور به درستی برقرار نشد');

                break;

            case SyncDataType.Gates:

                var result: boolean = await syncSmartGates();

                if (result) {
                    await upsertAlertToRFIDListener();
                    await upsertAlertToANPRListener();
                }

                if (!result) throw new Error('ارتباط با سرور به درستی برقرار نشد');

                break;

            default:
                throw new Error('نوع درخواستی معتبر نمی باشد');

        }


    };




    return {
        gateCameras,
        gateRfidAntennas,

        // Common
        upsertHistoryUpdateRequest,
        syncTrafficGroups,
        sendSyncDataRequest,
        getGateIds
    }
}