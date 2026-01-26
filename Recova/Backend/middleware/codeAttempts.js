import redis from "../services/redis.js";

// Check if user can attempt verification
export const checkCodeAttempts = async (req, res, next) => {
  try {
    const id = req.body.email || req.body.userId || req.ip;
    const key = `2fa:attempts:${id}`;
    
    const attempts = await redis.get(key);
    const count = parseInt(attempts || "0");
    
    if (count >= 5) {
      const ttl = await redis.ttl(key);
      return res.status(429).json({
        error: "Too many incorrect attempts",
        retryAfter: ttl > 0 ? ttl : 60,
        message: `Wait ${ttl > 0 ? ttl : 60} seconds before trying again`
      });
    }
    
    next();
  } catch (err) {
    console.error("Rate limit check error:", err);
    next(); // fail-open if Redis is down
  }
};

// Increment attempt counter
export const incrementAttempts = async (identifier) => {
  try {
    const key = `2fa:attempts:${identifier}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 60); // 60 second window
    }
    return count;
  } catch (err) {
    console.error("Increment attempts error:", err);
  }
};

// Clear attempts on success
export const clearAttempts = async (identifier) => {
  try {
    const key = `2fa:attempts:${identifier}`;
    await redis.del(key);
  } catch (err) {
    console.error("Clear attempts error:", err);
  }
};
