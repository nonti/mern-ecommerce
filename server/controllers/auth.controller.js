import { useId } from "react";
import { redis } from "../lib/redis.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'


const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'
  })

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) =>{
  await redis.set(`refreshToken: ${userId}`, refreshToken, "EX", 7*24*60*60)
}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60* 1000
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60* 1000
  })
}
export const register = async (req , res) =>{
  const { fullName, lastName, email, password} = req.body;

 try {
   const userExist = await User.findOne({email});
  if(userExist){
    return res.status(400).json({message: 'User already exists!'})
  }

  const user = await User.create({ fullName, lastName, email, password});

  //authenticate user
  const {accessToken, refreshToken} = generateTokens(user._id);
  await storeRefreshToken(user._id, refreshToken);

  setCookies(res, accessToken, refreshToken);

  res.status(201).json({ 
    user: {
      _id: user._id,
      fullName,
      lastName,
      email,
    }, 
    message: 'User registered successfully'});
 } catch (error) {
  res.status(500).json({ message: error.message});
 }
}


export const login = async (req , res) =>{

}
export const logout = async (req , res) =>{
  
}