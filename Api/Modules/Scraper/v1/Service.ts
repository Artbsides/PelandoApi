import { Injectable } from "@nestjs/common";
import { ScraperCacheRepository } from "./Repositories/Cache";
import { ScraperDatabaseRepository } from "./Repositories/Database";
import Product from "./Models/Product";
import { ProductDto } from "./Dtos/Product";
import { Parser } from "Api/SharedResources/Utils/Parser";
import { RequestsService } from "Api/SharedResources/Utils/Request";
import { Diff } from "Api/SharedResources/Utils/Diff";

@Injectable()
export class ScraperService {
  constructor(
    private readonly scraperCacheRepository: ScraperCacheRepository,
    private readonly scraperDatabaseRepository: ScraperDatabaseRepository,
    private readonly requests: RequestsService
  ) {}

  async getProduct(productDto: ProductDto): Promise<Product> {
    const cacheProduct = await this.scraperCacheRepository.find(productDto.url);

    if (cacheProduct) return cacheProduct;

    const databaseProduct = await this.scraperDatabaseRepository.find(productDto.url);

    if (databaseProduct) {
      const diffDatetime = new Diff.Datetime(new Date(), databaseProduct.updated_at);

      this.scraperCacheRepository.create(
        databaseProduct,
        new Diff.Numbers(process.env.REDIS_TTL, diffDatetime.getSeconds()).getRounded()
      );

      if (diffDatetime.getHours() < 1) return databaseProduct;
    }

    return await this.requests.get(productDto.url).then(async response => {
      const databaseProduct = await this.scraperDatabaseRepository.createOrUpdate({
        ...Parser.run(response.data),
        url: productDto.url
      });

      this.scraperCacheRepository.create(databaseProduct);

      return databaseProduct;
    });
  }
}
