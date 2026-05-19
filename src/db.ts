import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI no está definida en .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("🟢 MongoDB connected");
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`📦 DB: ${conn.connection.name}`);

  } catch (error: any) {
    console.error("🔴 Error connecting to MongoDB:");
    console.error(error.message);

    // 💣 MUY IMPORTANTE
    process.exit(1);
  }
};

export default connectDB;