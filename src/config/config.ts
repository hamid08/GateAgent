import dotenv from 'dotenv';
dotenv.config()


export default {
  port: process.env.PORT || 3000,
  mongo: {
    uri: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tracking-data-handler'
  },
  redis: {
    uri: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  socket: {
    gateSetting_Address: 'managementPanel',
    kiosk_Address: 'kiosk',
    rfidListener_Address: 'RFIDListener',
  },
  common: {
    allowedOrigins_Api: process.env.ALLOWED_ORIGINS_API || 'http://localhost:8383',
    vehicles_endPoint:'Gate/GetVehicles', // queryParams => list-> gateId=1 & pageNumber=2 & pageSize=10
    trafficGroups_endPoint:'Gate/GetTrafficGroup', // queryParams => list-> gateIds=1 & pageNumber=2 & pageSize=10
    smartGateUsers_endPoint:'Gate/GetSmartGateUsers', // queryParams => list-> gateIds=1 & pageNumber=2 & pageSize=10
    smartGates_endPoint:'Gate/GetSmartGate', // queryParams => list-> gateIds=1
    gateServiceHealth:'healthz'
  }

 
};

