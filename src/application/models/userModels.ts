

import {
    OperatorType
} from '../enums/gateEnum';




export class UserModel {

    constructor(
        userName: string,
        password: string,
        operatorTypes: OperatorType[],
        gateId?: string,

        id?: string,
        fName?: string,
        lName?: string,
    ) {

        this.id = id;
        this.fName = fName;
        this.lName = lName;

        this.userName = userName;
        this.password = password;
        this.operatorTypes = operatorTypes;
        this.gateId = gateId;

    }
    id?: string;
    fName?: string;
    lName?: string;
    userName: string;
    password: string;
    operatorTypes: OperatorType[];
    gateId?: string;

}


export class UserLoginInfoModel {

    constructor(
        operatorTypes: OperatorType[],
        userId: string
    ) {

        this.operatorTypes = operatorTypes;
        this.userId = userId;

    }


    userId: string;
    operatorTypes: OperatorType[];
}


export class UserProfileInfo {

    constructor(
        userName: string,
        operatorTypes: OperatorType[],
        fName?: string,
        lName?: string,
    ) {

        this.fName = fName;
        this.lName = lName;
        this.userName = userName;
        this.operatorTypes = operatorTypes;

    }


    fName?: string;
    lName?: string;
    userName: string;
    operatorTypes: OperatorType[];
}


export class UserGridModel {

    constructor(
        userId: string,
        userName: string,
        operatorTypes: OperatorType[],
        fName?: string,
        lName?: string,
    ) {
        this.userId = userId;
        this.fName = fName;
        this.lName = lName;
        this.userName = userName;
        this.operatorTypes = operatorTypes;

    }


    userId: string;
    fName?: string;
    lName?: string;
    userName: string;
    operatorTypes: OperatorType[];

}