
import { UserRefreshToken } from '../models/userRefreshToken';

import { userRefreshTokenModels } from '../../../../application/models/userRefreshTokenModels';

export default function userRefreshTokenRepository() {

    async function getUserRefreshTokenByUserIdAndRefreshToken(userId: string, refreshToken: string): Promise<userRefreshTokenModels | null> {
        var userRefreshToken: any = await UserRefreshToken.findOne({ userId, token: refreshToken });

        if (userRefreshToken?.expiration < new Date())
            return null;

        return userRefreshToken;

    }

    async function createUserRefreshToken(data: userRefreshTokenModels) {

        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        return await UserRefreshToken.findOneAndUpdate({ userId: data.userId }, {
            userId: data.userId,
            token: data.token,
            expiration: data.expiration,
        }, options);
    }


    async function deleteUserRefreshToken(userId: string) {
        return await UserRefreshToken.deleteOne({ userId });
    }


    return {
        getUserRefreshTokenByUserIdAndRefreshToken,
        createUserRefreshToken,
        deleteUserRefreshToken
    }


}
