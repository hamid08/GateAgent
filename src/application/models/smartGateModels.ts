import {
  SmartGateType,
  HumanDetectTools,
  ReactionAfterSuccessfulOperation,
  ReactionAfterUnSuccessfulOperation,
  SupervisoryType,
  VehicleDetectTools,
  SmartGatePriority,
  TaxiWorkModeOperation,
  AcceptanceType

} from '../enums/gateEnum';



export class AnprCamera {

  constructor(
    caption: string,
    identity: string,
    intervalTime: number,
    ip?: string,
    port?: number
  ) {
    this.caption = caption;
    this.identity = identity;
    this.ip = ip;
    this.port = port;
    this.intervalTime = intervalTime;

  }
  caption: string;
  identity: string;
  ip?: string;
  port?: number;
  intervalTime: number;

}

export class RfidAntenna {

  constructor(caption: string,
    identity: string,
    ip: string,
    port: number,
    intervalTime: number
  ) {
    this.caption = caption;
    this.identity = identity;
    this.ip = ip;
    this.port = port;
    this.intervalTime = intervalTime;
  }
  caption: string;
  identity: string;
  ip: string;
  port: number;
  intervalTime: number;

}

export class SmartGateGridModel {

  constructor(
    caption: string,
    identity: string,
    gateType: SmartGateType,
    terminalCaption: string,
    humanDetect: boolean,
    vehicleDetect: boolean,
    taxiWorkMode: boolean,
    trafficControlWorkMode: boolean,
    rfid: boolean,
    anpr: boolean,
    hf: boolean,
    offlineMode: boolean,

  ) {
    this.caption = caption;
    this.identity = identity;
    this.gateType = gateType;
    this.terminalCaption = terminalCaption;
    this.humanDetect = humanDetect;
    this.vehicleDetect = vehicleDetect;
    this.taxiWorkMode = taxiWorkMode;
    this.trafficControlWorkMode = trafficControlWorkMode;
    this.rfid = rfid;
    this.anpr = anpr;
    this.hf = hf;
    this.offlineMode = offlineMode;




  }
  caption: string;
  identity: string;
  gateType: SmartGateType;
  terminalCaption: string;
  humanDetect: boolean;
  vehicleDetect: boolean;
  taxiWorkMode: boolean;
  trafficControlWorkMode: boolean;
  rfid: boolean;
  anpr: boolean;
  hf: boolean;
  offlineMode: boolean;

}


export class SmartGateDetailsModel {

  constructor(
    caption: string,
    identity: string,
    gateType: SmartGateType,
    terminalCaption: string,
    taxiWorkMode: boolean,
    trafficControlWorkMode: boolean,
    offlineMode: boolean,

    description: string,

    supervisoryType: SupervisoryType,
    allowTimeSupervisoryGate: number,
    checkInSupervisoryGateCaption: string,

    taxiWorkModeInfo: SmartGateWorkMode,
    trafficControlWorkModeInfo: SmartGateWorkMode,

    reactionAfterSuccessfulOperations: ReactionAfterSuccessfulOperation[],
    reactionAfterUnSuccessfulOperations: ReactionAfterUnSuccessfulOperation[],


    anprCameras: AnprCamera[],
    rfidAntennas: RfidAntenna[]

  ) {
    this.caption = caption;
    this.identity = identity;
    this.gateType = gateType;
    this.terminalCaption = terminalCaption;
    this.taxiWorkMode = taxiWorkMode;
    this.trafficControlWorkMode = trafficControlWorkMode;
    this.offlineMode = offlineMode;

    this.description = description;

    this.taxiWorkMode = taxiWorkMode;

    this.trafficControlWorkMode = trafficControlWorkMode;
    this.taxiWorkModeInfo = taxiWorkModeInfo;
    this.trafficControlWorkModeInfo = trafficControlWorkModeInfo;

    this.reactionAfterSuccessfulOperations = reactionAfterSuccessfulOperations;
    this.reactionAfterUnSuccessfulOperations = reactionAfterUnSuccessfulOperations;


    this.supervisoryType = supervisoryType;
    this.checkInSupervisoryGateCaption = checkInSupervisoryGateCaption;
    this.allowTimeSupervisoryGate = allowTimeSupervisoryGate;


    this.anprCameras = anprCameras;
    this.rfidAntennas = rfidAntennas;

  }
  caption: string;
  identity: string;
  gateType: SmartGateType;
  terminalCaption: string;
  taxiWorkMode: boolean;
  trafficControlWorkMode: boolean;
  offlineMode: boolean;


  description: string;

  taxiWorkModeInfo: SmartGateWorkMode;
  trafficControlWorkModeInfo: SmartGateWorkMode;

  reactionAfterSuccessfulOperations: ReactionAfterSuccessfulOperation[];
  reactionAfterUnSuccessfulOperations: ReactionAfterUnSuccessfulOperation[];



  supervisoryType: SupervisoryType;
  checkInSupervisoryGateCaption: string;
  allowTimeSupervisoryGate: number;


  anprCameras: AnprCamera[];
  rfidAntennas: RfidAntenna[];
}


export class SmartGateWorkMode {

  constructor(

    taxiOperation: TaxiWorkModeOperation,
    priority: SmartGatePriority,
    acceptanceType: AcceptanceType,

    humanDetect: boolean,
    humanDetectTools: HumanDetectTools[],
    humanAcceptanceType: AcceptanceType,

    vehicleDetect: boolean,
    vehicleDetectTools: VehicleDetectTools[],
    vehicleAcceptanceType: AcceptanceType,


  ) {

    this.taxiOperation = taxiOperation;
    this.priority = priority;
    this.acceptanceType = acceptanceType;

    this.humanDetect = humanDetect;
    this.humanDetectTools = humanDetectTools;
    this.humanAcceptanceType = humanAcceptanceType;

    this.vehicleDetect = vehicleDetect;
    this.vehicleDetectTools = vehicleDetectTools;
    this.vehicleAcceptanceType = vehicleAcceptanceType;

  }

  taxiOperation: TaxiWorkModeOperation;
  priority: SmartGatePriority;
  acceptanceType: AcceptanceType;

  humanDetect: boolean;
  humanDetectTools: HumanDetectTools[];
  humanAcceptanceType: AcceptanceType;

  vehicleDetect: boolean;
  vehicleDetectTools: VehicleDetectTools[];
  vehicleAcceptanceType: AcceptanceType;





}



export class SmartGateModel {

  constructor(
    id: string,
    identity: string,
    caption: string,
    terminalCaption: string,
    description: string,
    gateType: SmartGateType,

    taxiWorkMode: boolean,
    taxiWorkModeInfo: SmartGateWorkMode,

    trafficControlWorkMode: boolean,
    trafficControlWorkModeInfo: SmartGateWorkMode,



    supervisoryType: SupervisoryType,
    checkInSupervisoryGateCaption: string,
    allowTimeSupervisoryGate: number,

    reactionAfterSuccessfulOperations: ReactionAfterSuccessfulOperation[],
    reactionAfterUnSuccessfulOperations: ReactionAfterUnSuccessfulOperation[],
    offlineMode: boolean,
    gateAcceptanceType: AcceptanceType,

    anprCameras: AnprCamera[],
    rfidAntennas: RfidAntenna[]

  ) {
    this.id = id;
    this.identity = identity;
    this.caption = caption;
    this.terminalCaption = terminalCaption;
    this.description = description;

    this.gateType = gateType;

    this.taxiWorkMode = taxiWorkMode;
    this.taxiWorkModeInfo = taxiWorkModeInfo;


    this.trafficControlWorkMode = trafficControlWorkMode;
    this.trafficControlWorkModeInfo = trafficControlWorkModeInfo;

    this.reactionAfterSuccessfulOperations = reactionAfterSuccessfulOperations;
    this.reactionAfterUnSuccessfulOperations = reactionAfterUnSuccessfulOperations;
    this.offlineMode = offlineMode;
    this.gateAcceptanceType = gateAcceptanceType;

    this.supervisoryType = supervisoryType;
    this.checkInSupervisoryGateCaption = checkInSupervisoryGateCaption;
    this.allowTimeSupervisoryGate = allowTimeSupervisoryGate;


    this.anprCameras = anprCameras;
    this.rfidAntennas = rfidAntennas;


  }
  id: string;
  identity: string;
  caption: string;
  terminalCaption: string;

  description: string;

  gateType: SmartGateType;


  // Taxi
  taxiWorkMode: boolean;
  taxiWorkModeInfo: SmartGateWorkMode;




  // Traffic Control
  trafficControlWorkMode: boolean;
  trafficControlWorkModeInfo: SmartGateWorkMode;



  reactionAfterSuccessfulOperations: ReactionAfterSuccessfulOperation[];
  reactionAfterUnSuccessfulOperations: ReactionAfterUnSuccessfulOperation[];
  offlineMode: boolean;
  gateAcceptanceType: AcceptanceType;


  // Supervisory
  supervisoryType: SupervisoryType;
  checkInSupervisoryGateCaption: string;
  allowTimeSupervisoryGate: number;


  anprCameras: AnprCamera[];
  rfidAntennas: RfidAntenna[];
}



export class RfidAntennaModel {
  constructor(
    public caption: string,
    public identity: string,
    public ip: string,
    public port: number,
    public gateId: string,
    public intervalTime: number
  ) {

  }

}

export class AnprCameraModel {
  constructor(
    public caption: string,
    public identity: string,
    public gateId: string,
    public intervalTime: number

  ) {

  }
}


export class TagDataModel {

  constructor(tag: string, rfidAntennaId: string, gateId: string, dateTime: Date) {
    this.Tag = tag;
    this.RFIDAntennaId = rfidAntennaId;
    this.GateId = gateId;
    this.DateTime = dateTime;
  }

  Tag: string;
  RFIDAntennaId: string;
  GateId: string;
  DateTime: Date;

}


export class ANPRDataModel {

  constructor(plate: string, cameraId: string, gateId: string, dateTime: Date,image:string) {
    this.Plate = plate;
    this.CameraId = cameraId;
    this.GateId = gateId;
    this.DateTime = dateTime;
    this.image = image;
  }

  Plate: string;
  CameraId: string;
  GateId: string;
  DateTime: Date;
  image:string;
}

export class HFDataModel {

  constructor(cardNo: string,gateId: string, dateTime: Date) {
    this.cardNo = cardNo;
    this.gateId = gateId;
    this.dateTime = dateTime;
  }

  cardNo: string;
  gateId: string;
  dateTime: Date;

}