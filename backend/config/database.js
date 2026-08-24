import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // This will now find process.env.MONGO_URI because of dotenv.config() in server.js
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    } 
}; 
//   charliegalang2905_db_user


//   CucEcJTxyucawiCR