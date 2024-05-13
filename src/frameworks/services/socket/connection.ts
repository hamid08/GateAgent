import config from '../../../config/config'
import moment from 'moment';
import { TagDataModel } from '../../../application/models/smartGateModels';
import { SocketModel } from '../../../application/models/gateSettingModels';
import socketService from '../../../application/services/socketService';
import { Socket } from 'socket.io';
import * as JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

import { Server as SocketIOServer } from 'socket.io';


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;


import {

    GateServicesType,
    SocketStatus,
    GateIdentificationType, IdentifierConnectionStatus

} from '../../../application/enums/gateEnum';


let socketIo: SocketIOServer;

var sockets: SocketModel[] = [];

// Set allowed origins
const allowedOrigins = config.common.allowedOrigins_Api.split(',');

// Create CORS options object
const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
};



export function setSocketIo(httpServer: any) {
    if (!socketIo) {
        socketIo = new SocketIOServer(httpServer, {
            serveClient: true,
            cors: corsOptions
        });
    }
}

export const getSocketIo = () => socketIo;


export const initConnection = () => {
    // Middleware to authenticate socket.io connections
    socketIo.use(async (socket: any, next: any) => {
        try {
            const token = socket.handshake.auth.token;

            const jwtToken = socket.handshake.headers.authorization?.split(' ')[1];


            if (!token && !jwtToken) {
                console.log('No token provided');
                return next(new Error('No token provided'));
            }

            if (jwtToken) {

                try {
                    const payload: any = JWT.verify(jwtToken, accessTokenSecret);
                    console.log('Gate Web Authenticated verified:', payload.aud);
                } catch (error) {
                    console.error('Gate Web Authenticated Invalid token:', error);
                    return next(new Error('Gate Web Authenticated Invalid token'));
                }

            }
            else if (token) {
                // Check if the token is valid for the gate service
                if (!(await socketService().findGateServiceToGateSettingByToken(token))) {
                    console.log(`Authenticated Error Socket Token: ${token}`);
                    return next(new Error(`Authenticated Error Socket Token: ${token}`));
                }

                console.log(`socket Authenticated Token: ${token}`);

            }

            next();
        }
        catch (err) {
            console.log(`Authenticated Error Socket`)
        }
    });


    socketIo.on('connection', async (socket: Socket) => {
        socket.emit('authenticated');

        const token = socket.handshake.auth.token;
        const jwtToken = socket.handshake.headers.authorization?.split(' ')[1];

        socket.emit('connected');


        var gateService: SocketModel | null = await socketService().getSocketConnectInfoByToken(token);

        if (gateService && gateService != null) {
            console.log(`==> Listener Socket connected By Id ${socket.id}`);

            const gateWebSocket = sockets.find(socket => socket.token === gateService?.token);
            if (!gateWebSocket) {
                gateService.socket = socket;
                sockets.push(gateService);

                //Socket To Gate Setting
                await socketIo.to(config.socket.gateSetting_Address).emit('ServiceSocketStatus', {
                    token: gateService?.token,
                    type: gateService?.type,
                    status: SocketStatus.Connect
                });


                //Socket To Operator Panel
                await socketIo.emit('IdentificationStatus', {
                    type: gateService?.type == GateServicesType.ANPRListener ?
                        GateIdentificationType.ANPR : GateIdentificationType.RFID,

                    status: IdentifierConnectionStatus.Connect
                });
            }



        }
        else if (jwtToken) {
            console.log(`==> Gate Web Socket connected By Id ${socket.id}`);
        }


        socket.on('disconnect', async () => {
            var socketInfo = sockets.find(c => c.socket?.id == socket.id);

            socket.emit('disConnected');



            if (socketInfo?.type != GateServicesType.GateWeb) {

                //Socket To Gate Setting
                await socketIo.to(config.socket.gateSetting_Address).emit('ServiceSocketStatus', {
                    token: socketInfo?.token,
                    type: socketInfo?.type,
                    status: SocketStatus.Disconnect
                });

                //Socket To Operator Panel
                await socketIo.emit('IdentificationStatus', {
                    type: socketInfo?.type == GateServicesType.ANPRListener ?
                        GateIdentificationType.ANPR : GateIdentificationType.RFID,

                    status: IdentifierConnectionStatus.Disconnect
                });

            }


            sockets = sockets.filter(c => c.socket?.id != socketInfo?.socket?.id);

            console.log(`==> Disconnected By Id ${socket.id}`);


        });

        socket.on('join_gate', (data: any) => {
            socket.join(data);
            console.log(`==>  Join To Address : ${data} by ${socket.id}`);
            socket.emit('joinGate');


        });

        socket.on('RFIDTag', (data: any) => {
            // sendToScreen(data)
            // console.log(JSON.stringify(data));
            socketService().proccesRFIDTag(data);

        });

        socket.on('ANPRData', async (data: any) => {
            // var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log(JSON.stringify(data));

            socketService().proccesANPRPlate(data);


        });


        socket.on('HFCard', (data: any) => {
            // sendToScreen(data)
            // console.log(JSON.stringify(data));
            socketService().proccesHFCard(data);
        });



        //عدم قابلیت باز کردن مودال آفلاین
        socket.on('OfflineModeFailed', (data: any) => {
            // sendToScreen(data)
            console.log(JSON.stringify(data));
          

        });


    });
}



export function getConnectedSocket(): SocketModel[] | null {
    return sockets;
}


export async function upsertAlertToRFIDListener() {
    try {

        socketIo.to("RFIDListener").emit('UpsertAlert', 'UpsertAlert');

    } catch (error) {
        console.log(error);
    }
}

export async function upsertAlertToANPRListener() {
    try {

        socketIo.to("ANPRListener").emit('UpsertAlert', 'UpsertAlert');

    } catch (error) {
        console.log(error);
    }
}

// export async function sendToScreen(emitName: string, data: any, gateId: string) {
//     try {

//         const gateWebSockets = sockets.filter(socket => socket.type === GateServicesType.GateWeb);

//         if (gateWebSockets && gateWebSockets.length > 0) {

//             gateWebSockets.forEach(element => {
//                 element.socket!.to(gateId).emit(emitName, data);
//             });

//         } else {
//             console.log(`No Found GateWeb socket connection`);
//         }
//     } catch (error) {
//         console.log(error);
//     }

// }

