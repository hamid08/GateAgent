
import User, { IUser } from '../models/user';

import { UserModel, UserLoginInfoModel, UserProfileInfo, UserGridModel } from '../../../../application/models/userModels';
import { BaseGridFilterModel, GridResultModel } from '../../../../application/models/baseModels';


import {
    OperatorType
} from '../../../../application/enums/gateEnum';


export default function userRepository() {


    async function createUser(data: UserModel) {
        const newUser = new User(data);
        newUser.password = (await newUser.encryptPassword(newUser.password)).toString();
        return await newUser.save();
    }


    async function changeUserPassword(userId: string, newPassword: string): Promise<boolean> {
        const user = await User.findOne({ _id: userId });
        if (!user) throw new Error('کاربر یافت نشد');

        // const matchOldPassword = await user?.validatePassword(oldPassword, user.password);
        // if (!matchOldPassword) throw new Error('رمز عبور فعلی نادرست می باشد');

        user.password = (await user.encryptPassword(newPassword)).toString();
        await user.save();

        return true;
    }


    async function CheckUserExist(userName: string): Promise<boolean> {
        const existingRecord = await User.findOne({ userName });
        if (!existingRecord) {
            return false;
        }
        else {
            return true;
        }
    }



    async function checkUserForLogin(userName: string, password: string): Promise<UserLoginInfoModel> {

        var user = await User.findOne({ userName });

        if (!user) throw new Error('کاربر یافت نشد');

        const matchPassword = await user?.validatePassword(
            password,
            user.password
        );

        if (!matchPassword) throw new Error('نام کاربری یا رمز عبور نادرست می باشد');

        return new UserLoginInfoModel(user?.operatorTypes, user?._id.toString());
    }



    async function getLoginUserInfoByUserId(userId: string): Promise<UserLoginInfoModel> {

        var user = await User.findOne({ _id: userId });

        if (!user) throw new Error('کاربر یافت نشد');

        return new UserLoginInfoModel(user?.operatorTypes, user?._id.toString());
    }


    async function getUserProfileInfo(userId: string): Promise<UserProfileInfo> {

        var user = await User.findOne({ _id: userId });

        if (!user) throw new Error('کاربر یافت نشد');

        return new UserProfileInfo(user?.userName, user?.operatorTypes, user?.fName, user?.lName);
    }



    async function getUserGrid(filterModel: BaseGridFilterModel): Promise<GridResultModel> {

        var { searchTerm, pageIndex, pageSize } = filterModel;

        if (pageIndex <= 0) pageIndex = 1;
        if (pageSize <= 0) pageSize = 10;

        const query: any = {
            $or: [
                { fName: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
                { lName: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
                { userName: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
            ],
            id: { $ne: '' }, // not Exclude admin user
        };

        const documents = await User.find(query)
            .skip((pageIndex - 1) * pageSize)
            .limit(pageSize)
            .sort({ name: 1 })
            .exec();

        var data = documents.map(document =>
            new UserGridModel(
                document._id.toString(),
                document.userName,
                document.operatorTypes,
                document.fName,
                document.lName,
            ));

        var total: number = 0;

        try {
            total = data.length;
        } catch (error) {

        }

        return new GridResultModel(data, total, pageIndex, pageSize);

    }


    return {
        createUser,
        checkUserForLogin,
        getLoginUserInfoByUserId,
        CheckUserExist,
        getUserProfileInfo,
        getUserGrid,
        changeUserPassword
    }


}
