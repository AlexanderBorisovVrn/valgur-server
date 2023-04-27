import * as dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT; 
export const mongodbUrl = process.env.MONGODB_URL