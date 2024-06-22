import mongoose from "mongoose";

const connectDB = async (db: string) => {
  const LOCAL_URI = `mongodb://localhost:27017/${db}`;

  try {
    await mongoose.connect(process.env.MONGODB_URI || LOCAL_URI);
    console.log("MongoDB connected");
  } catch (error) {
    throw error;
  }
};

export default connectDB;
