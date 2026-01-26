import redis from "../services/redis.js";

export const limitCodeAttempts = ({
  windowSec = 60,
  maxAttempts = 5,
  prefix = "ga:attempts"
} = {}) => async (req, res, next) => {
  try {
    // Identify the actor (email, user id, or IP)
    const id = req.user?.email || req.body.email || req.ip;
    const key = `${prefix}:${id}`;

    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, windowSec); // start the window
    }
    if (attempts > maxAttempts) {
      const ttl = await redis.ttl(key);
      return res.status(429).json({
        message: `Too many incorrect codes. Try again in ${ttl > 0 ? ttl : windowSec} seconds.`
      });
    }
    // Share remaining attempts with downstream handlers if you want
    req.codeAttemptsRemaining = Math.max(0, maxAttempts - attempts);
    next();
  } catch (err) {
    console.error("limitCodeAttempts error:", err);
    next();
  }
};