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



// Error Handler
app.use((err:any,req:any ,res: any ,next:any)=>{

    const statusCode = err.statusCode || 500 
    const message    = err.message    || "Something went wrong"
    const error      = err            

    return res.status(statusCode).json({
        statusCode,
        message,
        error
    })
    
})



/*
    Exports
*/
export default app;
