import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        // No need for 'useNewUrlParser' and 'useUnifiedTopology'
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;