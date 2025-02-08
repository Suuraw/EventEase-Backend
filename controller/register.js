import User from "../model&&schema/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
const salt=10;
export const register=async(req,res)=>{
 try {
  const {firstname,lastname,username,password}=req.body;
  if(!firstname||!lastname||!username||!password)
  {
    return res.status(400).json({message:"Missing fields"});
  }
  const hashPassword=await bcrypt.hash(password,salt);
  const userData = {
    name: {
      firstname: firstname,
      lastname: lastname,
    },
    username: username,
    password: hashPassword,
  };
  const user = await User.create(userData);
  const token=await jwt.sign({username:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
  return res.status(200).json({message:"User registered successfully",user,token,id:user._id});
 } catch (error) {
   if(error.code===11000)
   {
    return res.status(422).json({message:"Username exist"});
   }
   return res.status(500).json({message:"Failed insertion"});
 }
}