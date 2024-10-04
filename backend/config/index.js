import dotenv from 'dotenv';

dotenv.config();

export const {
    PORT, DEVELOPER_MODE, DB, JWT_SECRET
} = process.env;