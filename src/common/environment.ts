import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../', '.env') });

export const PORT = +process.env.PORT || 4000;
export const APP_ENV = process.env.APP_ENV || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const APP_VERSION = process.env.APP_VERSION || '0.0.1';
