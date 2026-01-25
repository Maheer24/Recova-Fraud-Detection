import Redis from "ioredis";

// Redis Cloud typically requires TLS; enable it when detected or explicitly set.
const useTls = process.env.REDIS_TLS === "true" || (process.env.REDIS_HOST || "").includes("redis-cloud.com");

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD,
  tls: useTls ? { rejectUnauthorized: false } : undefined,
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default client;