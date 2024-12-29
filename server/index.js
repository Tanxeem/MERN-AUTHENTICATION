import express from 'express';
import cors from 'cors';
import { FRONTEND_URL, PORT } from './config/serverConfig.js';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConfig.js';
import { errorMiddleware } from './middlewares/error.js';

const app = express();


app.use(cors({
    origin:[FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE" ],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(errorMiddleware)




app.listen(PORT, ()=> {
    console.log(`SERVER IS LISITING ON PORT NO: ${PORT}`)
    connectDB();
})
