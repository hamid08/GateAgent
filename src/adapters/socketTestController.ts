
import { faildResult, successResult } from '../application/utils/apiResult';
import { NextFunction, Request, Response } from 'express';

import socketTestService from '../application/services/socketTestService';


export default function socketTestController() {


    const anprTest = async (req: any, res: any, next: any) => {
        try {

            if (!req.query.hasOwnProperty('found')) {
                throw new Error('found الزامی می باشد');
            }

            const found = req.query.found == 'false'? false:true;

            await socketTestService().anprTest(found);

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const identityResultBox = async (req: any, res: any, next: any) => {
        try {

            if (!req.query.hasOwnProperty('type')) {
                throw new Error('نوع الزامی می باشد');
            }

            if (!req.query.hasOwnProperty('messageType')) {
                throw new Error('وضعیت اتصال الزامی می باشد');
            }

            const type = Number(req.query.type);
            const messageType = Number(req.query.messageType);


            await socketTestService().identityResultBox(type, messageType);

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const hfData = async (req: any, res: any, next: any) => {
        try {
            if (!req.query.hasOwnProperty('found')) {
                throw new Error('found الزامی می باشد');
            }

            const found = req.query.found == 'false'? false:true;


            await socketTestService().hfData(found);

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const rfidData = async (req: any, res: any, next: any) => {
        try {

            if (!req.query.hasOwnProperty('found')) {
                throw new Error('found الزامی می باشد');
            }

            const found = req.query.found == 'false'? false:true;


            await socketTestService().rfidData(found);

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const finishProcess = async (req: any, res: any, next: any) => {
        try {

            if (!req.query.hasOwnProperty('needTripNumber')) {
                throw new Error('needTripNumber الزامی می باشد');
            }

            const needTripNumber = req.query.needTripNumber == 'false'? false:true;

            await socketTestService().finishProcess(needTripNumber);

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const identificationStatus = async (req: any, res: any, next: any) => {
        try {


            if (!req.query.hasOwnProperty('type')) {
                throw new Error('نوع الزامی می باشد');
            }

            if (!req.query.hasOwnProperty('status')) {
                throw new Error('وضعیت اتصال الزامی می باشد');
            }

            const type = Number(req.query.type);
            const status = Number(req.query.status);


            await socketTestService().identificationStatus(type, status);

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const identificationReadData = async (req: any, res: any, next: any) => {
        try {


            if (!req.query.hasOwnProperty('type')) {
                throw new Error('نوع الزامی می باشد');
            }


            const type = Number(req.query.type);


            await socketTestService().identificationReadData(type);

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };





    return {
        anprTest,
        hfData,
        rfidData,
        finishProcess,
        identityResultBox,
        identificationStatus,
        identificationReadData

    }

}