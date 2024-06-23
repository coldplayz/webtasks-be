import mongoose from "mongoose";
import { join } from "path";

import { DATABASE_URI } from "@/lib/config";

const connectDB = async (db: string) => {
  const LOCAL_URI = `mongodb://localhost:27017/${db}`;

  try {
    // const uri = `${DATABASE_URI}${db}/?retryWrites=true&w=majority&appName=Cluster0`;
    const uri = `${DATABASE_URI}${db}`;
    // console.log(uri); // SCAFF
    // process.exit();
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    throw error;
  }
};

export default connectDB;
