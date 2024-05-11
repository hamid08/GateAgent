
import { faildResult, successResult } from '../application/utils/apiResult';
import { NextFunction, Request, Response } from 'express';

import socketTestService from '../application/services/socketTestService';


export default function socketTestController() {


    const anprTest = async (req: any, res: any, next: any) => {
        try {
           await socketTestService().anprTest();

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const identityResultBox_info = async (req: any, res: any, next: any) => {
        try {
           await socketTestService().identityResultBox_info();

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const identityResultBox_Error = async (req: any, res: any, next: any) => {
        try {
           await socketTestService().identityResultBox_Error();

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const identityResultBox_Success = async (req: any, res: any, next: any) => {
        try {
           await socketTestService().identityResultBox_Success();

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const hfData = async (req: any, res: any, next: any) => {
        try {
           await socketTestService().hfData();

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const rfidData = async (req: any, res: any, next: any) => {
        try {
           await socketTestService().rfidData();

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const scanTicketModal = async (req: any, res: any, next: any) => {
        try {
           await socketTestService().scanTicketModal();

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
        scanTicketModal,
        identityResultBox_info,
        identityResultBox_Error,
        identityResultBox_Success

    }

}