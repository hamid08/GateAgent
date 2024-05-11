import * as JWT from 'jsonwebtoken';
import * as createError from 'http-errors';

import userRefreshTokenRepository from '../../frameworks/database/mongoDB/repositories/userRefreshTokenRepository';
import userRepository from '../../frameworks/database/mongoDB/repositories/userRepository';

import { userRefreshTokenModels } from '../models/userRefreshTokenModels';
import { UserLoginInfoModel } from '../models/userModels';

import { faildResult, successResult } from '../utils/apiResult';

import dotenv from 'dotenv';
import { Data } from 'ws';
dotenv.config()


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;


interface TokenOptions {
    expiresIn: string;
    issuer: string;
    audience: string;
}

interface TokenResult {
    token: string;
    // expiration: number;
    expiration: Date;
}

export const signAccessToken = async (user: UserLoginInfoModel): Promise<TokenResult> => {

    const payload = { operatorTypes: user.operatorTypes };
    const options: TokenOptions = {
        expiresIn: '1h',
        issuer: 'PGA_Gate',
        audience: user.userId,
    };
    const token = JWT.sign(payload, accessTokenSecret, options);
    const expiration = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour in seconds
 
    const expirationDate = new Date(expiration * 1000); // convert seconds to milliseconds

    return { token, expiration:expirationDate };

};

export const verifyAccessToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next(createError.Unauthorized());
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    try {
        const payload = JWT.verify(token, accessTokenSecret);
        req.payload = payload;
        next();
    } catch (err: any) {
        const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        res.status(401).send(faildResult(message))

    }
};

export const signRefreshToken = async (user: UserLoginInfoModel): Promise<TokenResult> => {

    try {
        const payload = {};
        const options: TokenOptions = {
            expiresIn: '1y',
            issuer: 'PGA_Gate',
            audience: user.userId,
        };
        const token = JWT.sign(payload, refreshTokenSecret, options);
        const expiration = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year in seconds
        const expirationDate = new Date(expiration * 1000); // convert seconds to milliseconds

        //Add To Mongo
        await userRefreshTokenRepository().createUserRefreshToken(
            new userRefreshTokenModels(user.userId, token, expirationDate)
        );

        return { token, expiration:expirationDate };

    } catch (error) {
        console.log(error);
        throw createError.InternalServerError();
    }
};

export const verifyRefreshToken = async (refreshToken: string): Promise<UserLoginInfoModel> => {

    try {
        const payload: any = JWT.verify(refreshToken, refreshTokenSecret);
        const userId = payload.aud;

        // Get From Mongo
        var result = await userRefreshTokenRepository().getUserRefreshTokenByUserIdAndRefreshToken(userId, refreshToken);

        if (!result) {
            throw createError.Unauthorized();
        }

        return await userRepository().getLoginUserInfoByUserId(userId);
    } catch (err) {
        throw createError.Unauthorized();
    }
};


export async function deleteUserRefreshToken(user: UserLoginInfoModel) {

    return await userRefreshTokenRepository().deleteUserRefreshToken(user.userId);
}