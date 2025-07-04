import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
};