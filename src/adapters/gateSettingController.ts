import gateSettingService from '../application/services/gateSettingService';
import gateService from '../application/services/gateService';

import { faildResult, successResult } from '../application/utils/apiResult';
import { Express, Request, Response } from 'express';
import { TrafficGroupGridFilterModel } from '../application/models/trafficGroupModels';


export default function gateSettingController() {


    const getBasicConfig = async (req: any, res: any, next: any) => {
        try {

            res.status(200).send(successResult('', await gateSettingService().getBasicConfig()));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const editBasicConfig = async (req: any, res: any, next: any) => {
        try {

            if (!req.body.hasOwnProperty('basicConfigType')) {
                throw new Error('basicConfigType is required');
            }

            if (!req.body.hasOwnProperty('value')) {
                throw new Error('value is required');
            }


            const { basicConfigType, value } = req.body;

            res.status(200).send(successResult('', await gateSettingService().editBasicConfig(basicConfigType, value)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const testBasicConfig = async (req: any, res: any, next: any) => {
        try {

            if (!req.query.hasOwnProperty('basicConfigType')) {
                throw new Error('basicConfigType is required');
            }

            const basicConfigType = Number(req.query.basicConfigType);
            const value = req.query.value;

            await gateSettingService().testBasicConfig(basicConfigType, value);

            res.status(200).send(successResult());
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };



    const getSyncData = async (req: any, res: any, next: any) => {
        try {

            const { type } = req.query;


            res.status(200).send(successResult('', await gateSettingService().getSyncData(type)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const sendSyncDataRequest = async (req: any, res: any, next: any) => {
        try {

            if (!req.query.hasOwnProperty('type')) {
                throw new Error('نوع الزامی می باشد');
            }

            const type = Number(req.query.type);


            res.status(200).send(successResult('', await gateService().sendSyncDataRequest(type)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };




    const addGateId = async (req: any, res: any, next: any) => {
        try {

            if (!req.body.hasOwnProperty('gateId')) {
                throw new Error('شناسه گیت الزامی می باشد');
            }

            const { gateId } = req.body;

            await gateSettingService().addGateId(gateId);
            await gateService().syncTrafficGroups();

            res.status(200).send(successResult());
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const removeGateId = async (req: any, res: any, next: any) => {
        try {

            if (!req.params.hasOwnProperty('gateId')) {
                throw new Error('شناسه گیت الزامی می باشد');
            }

            const { gateId } = req.params;
            res.status(200).send(successResult('', await gateSettingService().removeGateId(gateId)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const getSmartGates = async (req: any, res: any, next: any) => {
        try {
            res.status(200).send(successResult('', await gateSettingService().getSmartGates()));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const getSmartGateById = async (req: any, res: any, next: any) => {
        try {

            if (!req.params.hasOwnProperty('gateId')) {
                throw new Error('شناسه گیت الزامی می باشد');
            }

            const { gateId } = req.params;

            res.status(200).send(successResult('', await gateSettingService().getSmartGateById(gateId)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const getTrafficGroupsByGateId = async (req: any, res: any, next: any) => {
        try {
            const { searchTerm, pageIndex, pageSize } = req.body;
            const { fromDate, toDate } = req.query;

            const { gateId } = req.params;


            res.status(200).send(successResult('', await gateSettingService()
                .getTrafficGroupsByGateId(gateId, new TrafficGroupGridFilterModel(searchTerm, pageIndex, pageSize, fromDate, toDate))));

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };



    const addGateService = async (req: any, res: any, next: any) => {
        try {

            if (!req.body.hasOwnProperty('type')) {
                throw new Error('نوع سرویس الزامی می باشد');
            }

            const { type } = req.body;

            res.status(200).send(successResult('', await gateSettingService().addGateService(type)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const removeGateServiceByToken = async (req: any, res: any, next: any) => {
        try {

            if (!req.params.hasOwnProperty('token')) {
                throw new Error('توکن سرویس الزامی می باشد');
            }

            const { token } = req.params;
            res.status(200).send(successResult('', await gateSettingService().removeGateServiceByToken(token)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const getGateServices = async (req: any, res: any, next: any) => {
        try {
            res.status(200).send(successResult('', await gateSettingService().getGateServices()));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    return {
        getSyncData,
        addGateId,
        getSmartGates,
        removeGateId,
        getSmartGateById,
        getTrafficGroupsByGateId,
        addGateService,
        removeGateServiceByToken,
        getGateServices,
        editBasicConfig,
        testBasicConfig,
        getBasicConfig,
        sendSyncDataRequest
    }

}