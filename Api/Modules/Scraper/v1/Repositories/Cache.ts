import { Injectable, Inject, CACHE_MANAGER, CacheStore } from "@nestjs/common";
import { Md5 } from "ts-md5";
import Product from "../Models/Product";

@Injectable()
export class ScraperCacheRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheStore) {}

  async find(url: string): Promise<Product | undefined> {
    return await this.cacheManager.get<Product>(Md5.hashStr(url));
  }

  async create(product: Product, ttl?: number): Promise<void> {
    await this.cacheManager.set<Product>(Md5.hashStr(product.url), product, { ttl: ttl });
  }
}
