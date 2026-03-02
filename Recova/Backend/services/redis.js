import Redis from "ioredis";

class RedisService {
  static instance = null;

  constructor() {
    if (RedisService.instance) {
      return RedisService.instance;
    }

    // Redis Cloud typically requires TLS; enable it when detected or explicitly set.
    const useTls =
      process.env.REDIS_TLS === "true" ||
      (process.env.REDIS_HOST || "").includes("redis-cloud.com");

    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      username: process.env.REDIS_USERNAME || "default",
      password: process.env.REDIS_PASSWORD,
      tls: useTls ? { rejectUnauthorized: false } : undefined,
    });

    this.client.on("connect", () => {
      console.log("✅ Connected to Redis");
    });

    this.client.on("error", (err) => {
      console.error("❌ Redis connection error:", err);
    });

    RedisService.instance = this;
  }

  static getInstance() {
    if (!RedisService.instance) {
      new RedisService();
    }
    return RedisService.instance.client;
  }

  getClient() {
    return this.client;
  }
}

export default RedisService.getInstance();