const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database connected"));
        const mongoURI = `${process.env.MONGODB_URI}`;
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }
        await mongoose.connect(mongoURI);
    } catch (error: any) {
        console.log(error.message);
    }
}

export default connectDB;