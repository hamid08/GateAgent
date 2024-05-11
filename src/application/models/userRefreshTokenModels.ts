
export class userRefreshTokenModels {

    constructor(
        userId: string,
        token: string,
        expiration: Date
        ) {

        this.userId = userId;
        this.token = token;
        this.expiration = expiration;

    }
    userId: string;
    token: string;
    expiration: Date;
}