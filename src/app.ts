import express from "express";
import dotenv  from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route"

dotenv.config();

const app  = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


/* 
    Routes 
*/
app.use("/api/v1/user", userRouter);



/*
    Exports
*/
export default app;
