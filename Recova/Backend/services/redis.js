import Redis from "ioredis";



const client = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: 'default',    
    password: process.env.REDIS_PASSWORD,
    
 

})

client.on("connect", () => {
    console.log("Connected to Redis");

})
client.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});
export default client;