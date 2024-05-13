import { Vehicle } from '../models/vehicle';
import { TrafficGroup } from '../models/trafficGroup';
import User from '../models/user';
import { UpdateRequestHistory } from '../models/updateRequestHistory';
import { SmartGate } from '../models/smartGate';
import moment from 'moment';
import { DriverModel, VehicleModel } from '../../../../application/models/vehicleModels';
import { TrafficGroupModel, TrafficGroupGridModel, TrafficGroupGridFilterModel } from '../../../../application/models/trafficGroupModels';
import {
  SmartGateModel,
  AnprCameraModel,
  RfidAntennaModel,
  SmartGateGridModel,
  SmartGateDetailsModel,
  AnprCamera,
  RfidAntenna
} from '../../../../application/models/smartGateModels';

import { encryptPassword,replaceChars } from '../../../../application/utils/generators';

import { UserModel } from '../../../../application/models/userModels';
import { GridResultModel } from '../../../../application/models/baseModels';

import {
  HumanDetectTools,
  SyncDataType, VehicleDetectTools
} from '../../../../application/enums/gateEnum';


export default function gateRepositoryMongoDB() {
  const findAll = async () => await Vehicle.find();

  const removeSmartGateByIdentity = async (identity: string) => {
    const result = await SmartGate.deleteOne({ identity });
    return result;
  };


  const removeTrafficGroupByGateId = async (gateId: string) => {
    const result = await TrafficGroup.deleteMany({ gateId });
    return result;
  };

  const addRange = async (entities: VehicleModel[]) => {
    var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');

    entities.forEach(async c => {
      try {
        const result = await Vehicle.updateMany(
          { id: c.id },
          c,
          { upsert: true }
        );
        console.log(`upserted vehicles success on mongoDB ${dateFormat}`);
      } catch (err: any) {
        console.error(`Error Inserting Vehicles: ${err}`);
      }
    });
  };

  const addRangeTrafficGroup = async (entities: TrafficGroupModel[]) => {
    var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');

    entities.forEach(async c => {
      try {
        const result = await TrafficGroup.updateMany(
          { id: c.id },
          c,
          { upsert: true }
        );
        console.log(`upserted trafficGroups success on mongoDB ${dateFormat}`);
      } catch (err: any) {
        console.error(`Error Inserting trafficGroups: ${err}`);
      }
    });
  };


  const addRangeSmartGateUsers = async (entities: UserModel[]) => {
    try {
      var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');

      for (const c of entities) {

        const newUser = new User(c);

        var userInDb = await User.findOne({ id: c.id });
        if (!userInDb) {
          newUser.password = 'AgentUop@134';
          newUser.password = (await newUser.encryptPassword(newUser.password)).toString();
          const result = await newUser.save();
          console.log(`created user success on mongoDB ${dateFormat}`);

        }
        else {
          const updatedUser = await User.findOneAndUpdate(
            { username: newUser.userName },
            { $set: { ...newUser.toObject(), password: undefined } }, // exclude password from the update
            { new: true }
          );
          console.log(`updated user success on mongoDB ${dateFormat}`);
        }

      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const addRangeSmartGate = async (entities: SmartGateModel[]) => {
    var dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');

    entities.forEach(async c => {
      try {
        const result = await SmartGate.updateMany(
          { id: c.id },
          c,
          { upsert: true }
        );
        console.log(`upserted smartGates success on mongoDB ${dateFormat}`);
      } catch (err: any) {
        console.error(`Error Inserting smartGates: ${err}`);
      }
    });
  };

  async function gateCameras(): Promise<AnprCameraModel[]> {
    const smartGates: SmartGateModel[] = await SmartGate.find({});

    let data: AnprCameraModel[] = [];

    smartGates.forEach((smartGate) => {

      smartGate.anprCameras.map((anprCamera) => {
        data.push(new AnprCameraModel(anprCamera.caption, anprCamera.identity, smartGate.identity, anprCamera.intervalTime));
      });

    });

    return data;
  }

  async function gateRfidAntennas(): Promise<RfidAntennaModel[]> {
    const smartGates: SmartGateModel[] = await SmartGate.find({});

    let data: RfidAntennaModel[] = [];

    smartGates.forEach((smartGate) => {

      smartGate.rfidAntennas.map((rfidAntenna) => {
        data.push(new RfidAntennaModel(rfidAntenna.caption, rfidAntenna.identity, rfidAntenna.ip, rfidAntenna.port, smartGate.identity, rfidAntenna.intervalTime));
      });


    });

    return data;
  }


  async function findInTaxiListByCardNo(cardNo: string): Promise<VehicleModel | null> {
    return await Vehicle.findOne({ rfidTag: cardNo }); //TODO Change to CardNo
  }

  async function findInTaxiListByTag(tag: string): Promise<VehicleModel | null> {
    return await Vehicle.findOne({ rfidTag: tag });
  }

  async function findInTrafficControlListByTag(tag: string): Promise<TrafficGroupModel | null> {
    return await TrafficGroup.findOne({ rfidTag: tag });
  }

  async function findInTrafficControlListByCardNo(cardNo: string): Promise<TrafficGroupModel | null> {
    return await TrafficGroup.findOne({ cardNumber: cardNo });
  }


  async function findVehicleByPlate(plate: string): Promise<VehicleModel | null> {

    try {
      const result = await Vehicle.findOne({ plaqueNo: plate });
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }



  // HistoryUpdateRequest
  const upsertHistoryUpdateRequest = async (type: SyncDataType) => {
    const filter = { type };
    const update = { dateTime: new Date() };
    const options = { upsert: true, new: true };

    const result = await UpdateRequestHistory.findOneAndUpdate(filter, update, options);

    return result;
  };


  async function getSmartGates(): Promise<SmartGateGridModel[]> {
    const documents = await SmartGate.find({});
    return documents.map(document =>
      new SmartGateGridModel(
        document.caption,
        document.identity,
        document.gateType,
        document.terminalCaption,
        document.taxiWorkModeInfo.humanDetect || document.trafficControlWorkModeInfo.humanDetect,
        document.taxiWorkModeInfo.vehicleDetect || document.trafficControlWorkModeInfo.vehicleDetect,
        document.taxiWorkMode,
        document.trafficControlWorkMode,
        document.taxiWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.RFID) || document.trafficControlWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.RFID),
        document.taxiWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.ANPR) || document.trafficControlWorkModeInfo.vehicleDetectTools.includes(VehicleDetectTools.ANPR),
        document.taxiWorkModeInfo.humanDetectTools.includes(HumanDetectTools.HF) || document.trafficControlWorkModeInfo.humanDetectTools.includes(HumanDetectTools.HF),
        document.offlineMode
      ));
  }


  async function getSmartGateById(gateId: string): Promise<SmartGateDetailsModel | null> {
    const document = await SmartGate.findOne({ identity: gateId });

    if (!document) {
      return null;
    }

    const anprCamerasMapped = document.anprCameras.map(anpr => new AnprCamera(anpr.caption, anpr.identity, anpr.intervalTime, anpr.ip, anpr.port));
    const rfidAntennasMapped = document.rfidAntennas.map(rfid => new RfidAntenna(rfid.caption, rfid.identity, rfid.ip, rfid.port, rfid.intervalTime));

    return new SmartGateDetailsModel(
      document.caption,
      document.identity,
      document.gateType,
      document.terminalCaption,
      document.taxiWorkMode,
      document.trafficControlWorkMode,
      document.offlineMode,
      document.description,
      document.supervisoryType,
      document.allowTimeSupervisoryGate,
      document.checkInSupervisoryGateCaption,
      document.taxiWorkModeInfo,
      document.trafficControlWorkModeInfo,

      document.reactionAfterSuccessfulOperations,
      document.reactionAfterUnSuccessfulOperations,


      anprCamerasMapped,
      rfidAntennasMapped,
    );
  }


  async function getSmartGateProccessInfoById(gateId: string): Promise<SmartGateModel | null> {
    return await SmartGate.findOne({ identity: gateId });
  }



  async function getTrafficGroupsByGateId(gateId: string, filterModel: TrafficGroupGridFilterModel): Promise<GridResultModel> {

    var { searchTerm, pageIndex, pageSize, fromDate, toDate } = filterModel;
    if (pageIndex <= 0) pageIndex = 1;
    if (pageSize <= 0) pageSize = 10;

    const query: any = {
      gateId,
      $or: [
        { plaqueNo: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        { presenterName: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        { rfidTag: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        { trafficGroupCaption: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
        { name: { $regex: `.*${searchTerm}.*`, $options: 'i' } },
      ],
    };

    if (fromDate) {
      query.fromDate = { $gte: new Date(fromDate) };
    }

    if (toDate) {
      query.toDate = { $lte: new Date(toDate) };
    }


    const documents = await TrafficGroup.find(query)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ name: 1 })
      .populate('gateId')
      .exec();


    var data = documents.map(document =>
      new TrafficGroupGridModel(
        document.trafficGroupCaption,
        document.plaqueNo,
        document.plaqueType,
        document.plaqueStatus,
        replaceChars(document.rfidTag),
        document.fromDate,
        document.toDate,
        document.name,
        document.presenterName,
        document.description,
        replaceChars(document.cardNumber),
      ));

    var total: number = 0;

    try {
      total = data.length;
    } catch (error) {

    }

    return new GridResultModel(data, total, pageIndex, pageSize);


  }

  return {
    findAll,
    addRange,
    addRangeTrafficGroup,
    addRangeSmartGate,
    gateCameras,
    gateRfidAntennas,
    findInTaxiListByTag,
    findVehicleByPlate,

    removeSmartGateByIdentity,
    getSmartGates,
    getSmartGateById,

    getTrafficGroupsByGateId,

    removeTrafficGroupByGateId,
    //HistoryUpdateRequest
    upsertHistoryUpdateRequest,

    addRangeSmartGateUsers,

    getSmartGateProccessInfoById,
    findInTrafficControlListByTag,

    findInTrafficControlListByCardNo,
    findInTaxiListByCardNo

  };
}



