import { Schema, model } from 'mongoose';


interface IUserRefreshToken {
    userId: string,
    token: string,
    expiration: Date
}


const userRefreshTokenSchema = new Schema<IUserRefreshToken>({
    userId: { type: String, required: true, index: true },
    token: String,
    expiration: Date,
});


export const UserRefreshToken = model<IUserRefreshToken>('UserRefreshToken', userRefreshTokenSchema);