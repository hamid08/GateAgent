
export enum VehiclePlaqueType {
    //شخصی
    Personal = 0,

    //قدیم
    Old = 1,

    //تاکسی
    Taxi = 2,

    //کشاورزی
    Agriculture = 3,

    //دولتی
    Governmental = 4,

    //پلیس
    Police = 5,

    //حمل و نقل عمومی
    Transportation = 6,

    //گذر موقت
    Temporary = 7,

    //موتور
    Motor = 8,

    //تاریخی
    Historical = 9,

    //تشریفات
    Formality = 10,

    //سیاسی
    Political = 11,

    //معلولین
    DisabledPeople = 12,

    //منطقه آزاد"
    FreeZone = 13,

    //تاکسی برون شهری
    SuburbanTaxi = 14,
};

export enum PlaqueStatus {

    // دارای پلاک
    HasPlaque = 0,

    //فاقد پلاک
    NoPlaque = 1,
}

const VehiclePlaqueTypeDisplayName: Record<VehiclePlaqueType, string> = {
    [VehiclePlaqueType.Personal]: "شخصی",
    [VehiclePlaqueType.Old]: "قدیم",
    [VehiclePlaqueType.Taxi]: "تاکسی",
    [VehiclePlaqueType.Agriculture]: "کشاورزی",
    [VehiclePlaqueType.Governmental]: "دولتی",
    [VehiclePlaqueType.Police]: "پلیس",
    [VehiclePlaqueType.Transportation]: "حمل و نقل عمومی",
    [VehiclePlaqueType.Temporary]: "گذر موقت",
    [VehiclePlaqueType.Motor]: "موتور",
    [VehiclePlaqueType.Historical]: "تاریخی",
    [VehiclePlaqueType.Formality]: "تشریفات",
    [VehiclePlaqueType.Political]: "سیاسی",
    [VehiclePlaqueType.DisabledPeople]: "معلولین",
    [VehiclePlaqueType.FreeZone]: "منطقه آزاد",
    [VehiclePlaqueType.SuburbanTaxi]: "تاکسی برون شهری",
};


export enum ReactionAfterSuccessfulOperation {
    OpenGate = 1,
    TurnOnGreenTrafficLight = 2,
    SendAllowedToPassToGateKiosk = 3,
}

export enum ReactionAfterUnSuccessfulOperation {
    CloseGate = 1,
    TurnOnRedTrafficLight = 2,
    SendNotAllowedToPassToGateKiosk = 3,
}

export enum SupervisoryType {
    CheckIn = 1,
    CheckOut = 2,
}

export enum HumanDetectTools {
    HF = 1,
}

export enum VehicleDetectTools {
    RFID = 1,
    ANPR = 2,
}

export enum SmartGatePriority {
    First = 1,
    Second = 2,
}

export enum TaxiWorkModeOperation {
    InStation = 1,
}

export enum SmartGateType {
    CheckPoint = 1,
    Supervisory = 2,
}

export enum AcceptanceType {
    All = 1,
    AtLeastOne = 2,
}


export enum SyncDataType {
    Vehicles = 1,
    Gates = 2,
    RFIDListenerUpdateAlert = 3,
    ANPRListenerUpdateAlert = 4,
    TrafficGroups = 5,
    SmartGateUsers = 6,
}

export enum GateServicesType {
    RFIDListener = 1,
    ANPRListener = 2,
    GateWeb = 3,
}


export enum SocketStatus {

    //متصل
    Connect = 1,

    //غیر متصل
    Disconnect = 2,
}


export enum BasicConfigType {

    // آدرس سامانه
    GateService = 1,

    // MongoDb
    MongoDb = 2,

    // Redis
    Redis = 3,
}


export enum OperatorType {

    // مدیر
    Manager = 1,

    // اپراتور
    Operator = 2,

}

export enum IdentityResultType {
    //اطلاعات
    Info = 1,

    //خطا
    Error = 2,

    // موفق
    Success = 3,
}


export enum IdentityMessageType {
    //عدم تطبیق در شناسایی
    MismatchInIdentification = 1,

    //عبور مجاز 
    AllowedToPass = 2,

    // عبور غیر مجاز
    NotAllowedToPass = 3,

    // شناسایی ناقص است
    IdentificationIsIncomplete = 4,

    // کارت را قرار دهید
    InsertTheCard = 5,

    // اسکن قبض سفر
    ScanTicket = 6,
}


export enum IdentificationProcessStatus {
    //موفق
    Successful = 1,

    //ناموفق
    UnSuccessful = 2,

    //آفلاین
    Offline = 3
}

export enum IdentificationProcessFinishReason {
    //اعتبارسنجی سمت سرور
    ServerValidation = 1,

    //پایان یافتن عملیت
    FinishProcess = 2,

    //انصراف توسط اپراتور
    CancelByOperator = 3,

    //انصراف توسط سیستم گیت
    CancelByGateSystem = 4,
}


export enum IdentificationProcessTrafficType {
    //حمل و نقل (تاکسی)
    Taxi = 1,

    //کنترل تردد
    TrafficControl = 2,
}


export enum IdentifierConnectionStatus {
    //وصل
    Connect = 1,

    //قطع
    Disconnect = 2,
}

export enum GateIdentificationType {
    RFID = 1, // تگ خوان
    ANPR = 2, // پلاک خوان
    NetAccess = 3, // شبکه اینترنت داخلی
    ServiceServer = 4, // گیت سرویس نقلیه
    LocalAgent = 5, // سرور ایجنت گیت
    HF = 6

}

export enum GateIdentificationTestType {
    Client = 1, // تست توسط خود کلاینت که همان gate web هست 
    Server = 2, // تست توسط api و سرور
    Socket = 3, //  تست توسط سوکت و در لحظه اعلان می شود
}


export enum OfflineTrafficsType {
    //موفق
    Successful = 1,

    //ناموفق
    UnSuccessful = 2,

    //در صف ارسال
    InQueue = 3,
}

