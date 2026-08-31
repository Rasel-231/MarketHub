import Redis from "ioredis";
import config from "../../../config";


export const redis = new Redis({
    host: config.redis_url,
    db: 1,
});

redis.on("connect", () => {
    console.log("✅ Redis connected");
});

redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

export const queueRedisConnection = {
    host: config.redis_url,
    maxRetriesPerRequest: null,
};
