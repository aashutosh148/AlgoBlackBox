import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB database.');
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
  }
};

export default connectDB;
