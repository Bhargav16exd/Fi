import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URL : string | undefined = process.env.MONGODB_URL;

const connectToDatabase = async () =>{
    try {
        
        if (!MONGODB_URL) return console.error("MONGODB_URL is not defined")

        const connection = await mongoose.connect(`${MONGODB_URL}/${process.env.DB_NAME}`)

        console.log('Mongo DB Connected Successfully : ',connection.connection.host)
        
    } catch (error) {
        
        console.error(error)

    }
}


export default connectToDatabase;