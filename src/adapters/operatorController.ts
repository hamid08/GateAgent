
import { faildResult, successResult } from '../application/utils/apiResult';
import operatorService from '../application/services/operatorService';


export default function operatorController() {


    const getGates = async (req: any, res: any, next: any) => {
        try {

            res.status(200).send(successResult('', await operatorService().getGates()));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    }


    const getGateDetailsById = async (req: any, res: any, next: any) => {
        try {

            if (!req.params.hasOwnProperty('gateId')) {
                throw new Error('شناسه گیت الزامی می باشد');
            }

            const { gateId } = req.params;

            res.status(200).send(successResult('', await operatorService().getGateDetailsById(gateId)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    }


    const getLivePlaqueImage = async (req: any, res: any, next: any) => {
        try {

            if (!req.params.hasOwnProperty('gateId')) {
                throw new Error('شناسه گیت الزامی می باشد');
            }

            const { gateId } = req.params;

            res.status(200).send(successResult('', await operatorService().getLivePlaqueImage(gateId)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    }


    const connectionTest = async (req: any, res: any, next: any) => {
        try {

            if (!req.params.hasOwnProperty('gateId')) {
                throw new Error('شناسه گیت الزامی می باشد');
            }

            if (!req.query.hasOwnProperty('type')) {
                throw new Error('نوع الزامی می باشد');
            }

            const type = Number(req.query.type);

            const { gateId } = req.params;

            res.status(200).send(successResult('', await operatorService().connectionTest(gateId, type)));
        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    }


    const scanTicketOffline = async (req: any, res: any, next: any) => {
        try {
            if (!req.params.hasOwnProperty('gateId')) {
                throw new Error('شناسه گیت الزامی می باشد');
            }

            if (!req.body.hasOwnProperty('tripNumber')) {
                throw new Error('شماره سفر الزامی می باشد');
            }

            const { tripNumber } = req.body;

            const { gateId } = req.params;


            res.status(200).send(successResult('', await operatorService().scanTicketOffline(gateId, tripNumber)));

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const scanTicketOnline = async (req: any, res: any, next: any) => {
        try {
            if (!req.params.hasOwnProperty('gateId')) {
                throw new Error('شناسه گیت الزامی می باشد');
            }

            if (!req.body.hasOwnProperty('tripNumber')) {
                throw new Error('شماره سفر الزامی می باشد');
            }

            const { tripNumber } = req.body;

            const { gateId } = req.params;


            res.status(200).send(successResult('', await operatorService().scanTicketOnline(gateId, tripNumber)));

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    return {
        getGates,
        getGateDetailsById,
        connectionTest,
        getLivePlaqueImage,
        scanTicketOffline,
        scanTicketOnline
    }

}