
import { faildResult, successResult } from '../application/utils/apiResult';
import { NextFunction, Request, Response } from 'express';

import userService from '../application/services/userService';
import { BaseGridFilterModel } from '../application/models/baseModels';


export default function userController() {


    const changeUserPassword = async (req: any, res: any, next: any) => {
        try {

            if (!req.params.hasOwnProperty('userId')) {
                throw new Error('شناسه کاربر الزامی می باشد');
            }

            if (!req.body.hasOwnProperty('newPassword')) {
                throw new Error('رمز عبور الزامی می باشد');
            }

            const { userId } = req.params;
            const {newPassword } = req.body;

            var result:boolean = await userService().changeUserPassword(userId, newPassword);

            res.status(200).send(result?successResult() : faildResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const getUserGrid = async (req: any, res: any, next: any) => {
        try {
            const { searchTerm, pageIndex, pageSize } = req.body;

            res.status(200).send(successResult('', await userService()
                .getUserGrid(new BaseGridFilterModel(searchTerm, pageIndex, pageSize))));

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    return {
        getUserGrid,
        changeUserPassword

    }

}