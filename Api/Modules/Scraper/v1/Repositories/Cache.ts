import { plainToClass } from "@nestjs/class-transformer";
import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Md5 } from "ts-md5";
import Product from "../Models/Product";

@Injectable()
export class ScraperCacheRepository {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async find(url: string): Promise<Product|null> {
    const product = await this.cacheManager.get(Md5.hashStr(url));

    if (product)
      return plainToClass(Product, product);

    return null;
  }

  async create(product: Product): Promise<void> {
    await this.cacheManager.set(Md5.hashStr(product.url), product);
  }
}
