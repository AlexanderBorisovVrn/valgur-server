import * as dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT;
export const mongodbUrl = process.env.MONGODB_URL;
export const cloudinaryName = process.env.CLOUDINARY_NAME;
export const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
export const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
export const accessTokenSycret = process.env.ACCESS_TOKEN_SYCRET;
export const refreshTokenSycret = process.env.REFRESH_TOKEN_SYCRET;