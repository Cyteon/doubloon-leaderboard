import redis from "redis";
import { REDIS_URI } from "$env/static/private";

const client = redis.createClient({ url: REDIS_URI });

client.connect()
    .then(() => {
        console.log("Connected to Redis.");
    })
    .catch((e) => {
        console.error("Failed to connect to Redis: ", e);
    });

export default client;