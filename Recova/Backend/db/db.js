import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const connectDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb://localhost:27017/recova")
        if(connect){
            console.log('MongoDB connected')
        }
    }
    catch (err) {
        console.error(err.message);
    }
}
export default connectDB;