import User from "../model&&schema/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotevn from "dotenv";
dotevn.config();
export const login=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username:username})
        if(!user)
        {
            return res.status(401).json({message:"Invalid username"})
        }
         const comparePassword=await bcrypt.compare(password,user.password)
         if(!comparePassword)
         {
            return res.status(401).json({message:"You have entered the wrong password"});
         }
         const token=await jwt.sign({username:username},process.env.JWT_SECRET,{expiresIn:"1h"});
         return res.status(200).json({message:"Login successfull",token,id:user._id});
        }
     catch (error) {
        return res.status(404).json({message:"Error with query"});
    }
}