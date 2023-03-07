import { CacheModule, CacheStore, Module } from "@nestjs/common";
import { redisStore } from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async () => ({
        store: (await redisStore({
          ttl: Number(process.env.REDIS_TTL),
          url: process.env.REDIS_CONNECTION_STRING
        }).catch(e => {
          console.log(e);
        })) as unknown as CacheStore
      })
    })
  ]
})
export class RedisModule {}
