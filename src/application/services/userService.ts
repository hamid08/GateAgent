
import userRepository from '../../frameworks/database/mongoDB/repositories/userRepository';

import { UserModel, UserLoginInfoModel, UserProfileInfo, UserGridModel } from '../models/userModels';
import { BaseGridFilterModel,GridResultModel } from '../models/baseModels';



import httpsAgent from '../../config/axiosConfig';
import axios from 'axios';
import config from '../../config/config';


import {
    OperatorType
} from '../enums/gateEnum';

export default function userService() {

    const axiosInstance = axios.create({
        httpsAgent
    });


    const createDefaultUser = async () => {

        try {

            if (!await userRepository().CheckUserExist('Admin')) {
                await userRepository().createUser(new UserModel(
                    'Admin',
                    'Admin@110',
                    [OperatorType.Manager],
                    '',
                    '',
                    'ادمین',
                    'ادمین زاده اصل'
                ));
            }


        } catch (error) {
            console.error(error);
        }

    }


    const checkUserForLogin = async (userName: string, password: string) => {
        return await userRepository().checkUserForLogin(userName, password);
    }

    const getUserProfileInfo = async (userId: string): Promise<UserProfileInfo> => {

        return await userRepository().getUserProfileInfo(userId);
    }


    const getUserGrid = async (filterModel: BaseGridFilterModel)
        : Promise<GridResultModel> => {
        try {
            return await userRepository().getUserGrid(filterModel);

        } catch (error) {
            console.error(error)
            throw new Error();

        }

    }

    const changeUserPassword = async (userId: string, newPassword: string)
        : Promise<boolean> => {
        return await userRepository().changeUserPassword(userId, newPassword);
    }

    return {
        createDefaultUser,
        checkUserForLogin,
        getUserProfileInfo,
        getUserGrid,
        changeUserPassword
    }
}