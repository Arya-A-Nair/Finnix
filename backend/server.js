import express from 'express';
import router from './routes';
import connectDB from './config/database';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

global.appRoot = path.resolve(__dirname);
app.use(express.json());
app.use('/', router);
connectDB();
app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`App Running at Port ${PORT}`);
});
