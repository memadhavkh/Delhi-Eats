// JUVmk5fdwuEJcRwq
// khandelwalmadhav5
import mongoose from 'mongoose';
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI!); // the ! specifies that MONGO_URI is not undefined
        console.log("MongoDB Connected");
    } catch(error) {
        process.exit(1); // If connection fails, process will exit with a status code of 1. This will cause the script to fail and stop execution.
    }
}

export default connectDB;