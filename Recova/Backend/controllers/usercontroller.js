import usermodel from "../models/usermodel.js";

import * as userservice  from "../services/userservice.js";
import {generateContent} from "../services/aiservice.js";
import { validationResult } from "express-validator";
import redisclient from '../services/redis.js'



export const createuserController = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({errors:errors.array()})
    }
    
    try{
        const {email,password} = req.body;
     
        const existinguser = await usermodel.findOne({email:req.body.email});
        
        if(existinguser){
            return res.status(400).json({message:"This email is already registered"});
        }
        if (!password || password.length < 6 && password.length > 20 ){
            return res.status(400).json({message:"Password should be atleast 6 characters"});

        }
        const user = await userservice.createuser(req.body);
        const token = await user.generatetoken();
        delete user._doc.password;
        return res.status(201).json({user , token});

        
     
    }catch(error){
        return res.status(500).send({ errormessage: error.message || "Internal server error" });
    }
}


export const loginController = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({errors:errors.array()})
    }

    const {email,password} = req.body;
    try{
        const user = await usermodel.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({errormessage:"Invalid credentials"});
        }
        const isMatch = await user.comparepassword(password);
        if(!isMatch){
            return res.status(401).json({errormessage:"Invalid credentials"});
        }
        

        const token = await user.generatetoken();
       

       
        
        delete user._doc.password;
        return res.status(200).json({user,token});
        

    }
    catch(error){
        return res.status(500).send({ errormessage: error.message });
    }


}

export const profileController = async (req,res) => {
    try {
        console.log(req.user);  // You should see { email, name, profilePic }

        // Send the user's profile picture and other info to the front-end
        return res.status(200).json({
            email: req.user.email,
            name: req.user.name,
            profilePic: req.user.profilePic
        });

    } catch (error) {
        return res.status(500).send({ errormessage: error.message });
    }
   

}
export const logoutController = async (req,res) => {

    try{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // 🔥 If JWT token exists, invalidate it
    if (token) {
        redisclient.set(token, "logout", 'EX', 3600);

        console.log(token, "JWT token invalidated");
        console.log("JWT token invalidated");

    }

    const googleSession = req.cookies["connect.sid"]; // Passport session cookie
        if (googleSession) {
            console.log("Google session detected, logging out...");
        }

        // 3️⃣ Clear both JWT and Google session cookies
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
        res.clearCookie("connect.sid", { httpOnly: true, secure: true, sameSite: "None" });

        console.log("User logged out successfully");
       
        res.status(200).json({
            message: "User logged out successfully",
            redirectUrl: "http://localhost:5173"
        });
     

    } 
    catch(error){
        return res.status(400).send({ errormessage: error.message });
    }
}



export const getaicontroller= async (req,res)=>{
    const userQuestion = req.body.message;

    if(!userQuestion){
        return res.status(400).send("Message is required");
        
    }

    try {
    const response = await generateContent(userQuestion);
    res.json({ reply: response });
        
    } catch (error) {
        console.error("Error generating content:", error);  // Log the error here
        return res.status(500).send({ errormessage: error.message, stack: error.stack });
    }

   
   
   
}

// 2FA rate limiting endpoints
export const check2FAAttempt = async (req, res) => {
    const { email, userId } = req.body;
    const identifier = email || userId || req.ip;
    
    try {
        const key = `2fa:attempts:${identifier}`;
        const attempts = await redisclient.get(key);
        const count = parseInt(attempts || "0");
        
        if (count >= 5) {
            const ttl = await redisclient.ttl(key);
            return res.status(429).json({
                allowed: false,
                retryAfter: ttl > 0 ? ttl : 60,
                message: `Too many incorrect attempts. Wait ${ttl > 0 ? ttl : 60} seconds.`
            });
        }
        
        // Just check, don't increment yet
        return res.status(200).json({ 
            allowed: true, 
            attemptsRemaining: Math.max(0, 5 - count) 
        });
    } catch (error) {
        console.error("2FA check error:", error);
        return res.status(200).json({ allowed: true }); // fail-open
    }
};

export const recordFailedAttempt = async (req, res) => {
    const { email, userId } = req.body;
    const identifier = email || userId || req.ip;
    
    try {
        const key = `2fa:attempts:${identifier}`;
        const newCount = await redisclient.incr(key);
        if (newCount === 1) {
            await redisclient.expire(key, 60); // 60 second cooldown window
        }
        
        // If user just hit the limit (5th attempt), reset TTL to full 60 seconds
        if (newCount === 5) {
            await redisclient.expire(key, 60);
        }
        
        return res.status(200).json({ 
            attemptsRemaining: Math.max(0, 5 - newCount) 
        });
    } catch (error) {
        console.error("Record failed attempt error:", error);
        return res.status(500).json({ error: error.message });
    }
};


export const clear2FAAttempts = async (req, res) => {
    const { email, userId } = req.body;
    const identifier = email || userId || req.ip;
    
    try {
        await redisclient.del(`2fa:attempts:${identifier}`);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Clear attempts error:", error);
        return res.status(500).json({ error: error.message });
    }
};


