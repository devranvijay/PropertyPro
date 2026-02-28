import mongoose from 'mongoose';
let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/propertypro');
        isConnected = !!conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        // In serverless, we throw error instead of process.exit
        throw error;
    }
};
