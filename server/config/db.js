import mongoose from 'mongoose'

 
const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Connection failed:", error.message);
  }
};

export default connectDB