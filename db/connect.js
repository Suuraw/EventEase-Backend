import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URI=process.env.URI;
console.log(URI);
export const connectDB=async()=>{
  try {
    await mongoose.connect(URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true   
    })
    console.log('Database connection established');
  } catch (error) {
    console.log(`Connection failed`,error);
    process.exit(1);
  }
}
export default connectDB;