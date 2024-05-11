
import { faildResult, successResult } from '../application/utils/apiResult';
import { NextFunction, Request, Response } from 'express';

import userService from '../application/services/userService';

import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
    deleteUserRefreshToken,


} from '../application/services/jwtService';


export default function authController() {


    const login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userName, password } = req.body;

            if (!req.body.hasOwnProperty('userName')) {
                throw new Error('userName is required');
            }

            if (!req.body.hasOwnProperty('password')) {
                throw new Error('password is required');
            }


            var userInfo = await userService().checkUserForLogin(userName, password);

            //GenerateToken

            const accessToken = await signAccessToken(userInfo);
            const refreshToken = await signRefreshToken(userInfo);

            res.status(200).send(successResult('', {
                accessToken: accessToken.token,
                accessTokenExpiration: accessToken.expiration,
                refreshToken: refreshToken.token,
                refreshTokenExpiration: refreshToken.expiration
            }));

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) throw new Error('Unauthorized');
            const bearerToken = authHeader.split(' ');
            const refreshToken = bearerToken[1];

            if (!refreshToken) throw new Error('Unauthorized');
            const userInfo = await verifyRefreshToken(refreshToken)

            //GenerateToken
            const accessToken = await signAccessToken(userInfo);
            const refToken = await signRefreshToken(userInfo);

            res.status(200).send(successResult('',
                {
                    accessToken: accessToken.token,
                    accessTokenExpiration: accessToken.expiration,
                    refreshToken: refToken.token,
                    refreshTokenExpiration: refToken.expiration
                }
            ));

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw new Error();
            const userInfo = await verifyRefreshToken(refreshToken)

            await deleteUserRefreshToken(userInfo);

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    const authorizeTest = async (req: Request, res: Response, next: NextFunction) => {
        try {

            res.status(200).send(successResult());

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };

    const profile = async (req: any, res: Response, next: NextFunction) => {
        try {

            const userId = req.payload.aud;

            var userProfileInfo = await userService().getUserProfileInfo(userId);


            res.status(200).send(successResult('',userProfileInfo));

        } catch (error: any) {
            console.error(error);
            res.status(200).send(faildResult(error.message));
        }
    };


    return {
        login,
        refreshToken,
        logout,
        profile,
        authorizeTest

    }

}