import { Schema, model, Document } from 'mongoose';
import bcrypt from "bcrypt";

import {
    OperatorType
} from '../../../../application/enums/gateEnum';

export interface IUser extends Document {
    id?: string,
    fName?: string,
    lName?: string,
    gateId?: string,
    userName: string;
    password: string;
    operatorTypes: OperatorType[];

    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string, receivePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        id: {
            type: String,
            required: false,
        },
        fName: {
            type: String,
            required: false,
        },
        lName: {
            type: String,
            required: false,
        },
        gateId: {
            type: String,
            required: false,
        },
        userName: {
            type: String,
            minlength: 4,
            required: true,
        },
        password: {
            type: String,
            minlength: 6,
            required: true,
        },
        operatorTypes: [{ type: Number, enum: OperatorType }],

    },
    {
        timestamps: true,
    }
);

/**
 * A promise to be either resolved with the encrypted data salt or rejected with an Error
 */
// UserSchema.pre<IUser>("save", async function (next) {
//     const user = this;
//     if (!user.isModified("password")) return next();

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(user.password, salt);
//     user.password = hash;
//     next();
// });

UserSchema.methods.encryptPassword = async function (
    password: string
): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

UserSchema.methods.validatePassword = async function (
    password: string,
    receivePassword: string
): Promise<boolean> {
    return await bcrypt.compareSync(password, receivePassword);
};

UserSchema.index({ userName: 1, password: 1 });
export default model<IUser>("User", UserSchema);