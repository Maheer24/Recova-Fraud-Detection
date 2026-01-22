import jwt from "jsonwebtoken"
// import redisclient from '../services/redis.js'
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with ANON KEY for token verification
const supabaseUrl = 'https://hyspncvztfiefpxgaumo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5c3BuY3Z6dGZpZWZweGdhdW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTgyNDQsImV4cCI6MjA4Mzk5NDI0NH0.gsg8B4sW5gg4Ak7OiNnMYya07N4CnUw6a3cjHFm-ceg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);



export const authuser = async (req, res, next) => {
    console.log("Auth middleware running...");
    

    try {
        console.log("finding token")

        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
        // console.log("authorization header", req.headers.authorization)

        if (!token) {
            console.log("No token found in cookies or headers.");
            return res.status(401).send({ errormessage: "Unauthorized user - No token provided." });
        }

        console.log("✅ Token Detected. Verifying with Supabase...");
        console.log("🔍 Token (first 20 chars):", token?.substring(0, 20));

        // Create a Supabase client with the user's access token to verify it
        const supabaseWithToken = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });

        // Verify the token by getting the user
        const { data: { user }, error } = await supabaseWithToken.auth.getUser();

        console.log("🔍 Supabase response - user:", user);
        console.log("🔍 Supabase response - error:", error);

        if (error || !user) {
            console.log("❌ Supabase token verification failed:", error?.message);
            console.log("❌ Full error object:", JSON.stringify(error, null, 2));
            return res.status(401).send({ errormessage: "Unauthorized user - Invalid token." });
        }

        console.log("✅ Supabase User Authenticated:", user.email);

        // Attach user info to request
        req.user = {
            authType: "supabase",
            email: user.email,
            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email,
            profilePic: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            id: user.id,
        };

        next();
    } catch (error) {
        console.error("❌ Authentication Error:", error.message);
        return res.redirect('http://localhost:5173/login');
        
        // return res.status(401).send({ errormessage: "Unauthorized user." });
       
        
    }
};

   
