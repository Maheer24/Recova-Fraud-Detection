import jwt from "jsonwebtoken"
import redisclient from '../services/redis.js'
import axios from 'axios';




export const authuser = async (req, res, next) => {
    console.log("Auth middleware running...");
    

    try {
        console.log("finding token")

        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
        // console.log("authorization header", req.headers.authorization)

        if (!token) {
            console.log("No token found in cookies or headers.");
            console.log("now finding google session cookie");

            // Check if user is authenticated via Google OAuth
            if (req.isAuthenticated() && req.user?.accessToken) {
                console.log("✅ Google User Found in Session:", req.user.displayName);
                console.log("🔹 Google Access Token:", req.user.accessToken);

                req.user = {
                    authType: "google",
                    email: req.user.emails[0].value,
                    name: req.user.displayName,
                    profilePic: req.user.photos[0].value,
                    accessToken: req.user.accessToken,
                };

                return next();
            } else {
                console.log("❌ No Google session found.");
                return res.status(401).send({ errormessage: "Unauthorized user from Google session." });
            }
        }

        console.log("✅ JWT Token Detected. Verifying...", token);

        const blockedtoken = await redisclient.get(token);
        if (blockedtoken) {
            console.log("❌ Token is blocked:", token);
            return res.status(401).send({ errormessage: "Unauthorized user." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Authentication Error:", error.message);
        return res.status(401).send({ errormessage: "Unauthorized user." });
    }
};

   
