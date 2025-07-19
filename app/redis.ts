import { Redis } from "ioredis";
import { env } from "./env.server";

const redisUrl = env().REDIS_URL;

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("[Redis] Conectado");
});

redis.on("ready", () => {
  console.log("[Redis] Pronto para uso");
});

redis.on("error", (err) => {
  console.error("[Redis] Erro:", err);
});

redis.on("close", () => {
  console.log("[Redis] Conexão fechada");
});

redis.on("reconnecting", () => {
  console.log("[Redis] Reconectando...");
});

function createRedisClient() {
  const client = new Redis(redisUrl);

  client.on("connect", () => {
    console.log("[RedisClient] Conectado");
  });
  client.on("error", (err) => {
    console.error("[RedisClient] Erro:", err);
  });

  return client;
}

export { createRedisClient };
