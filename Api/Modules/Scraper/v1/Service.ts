import { Injectable } from "@nestjs/common";
import { plainToClass } from "@nestjs/class-transformer";
import { ScraperCacheRepository } from "./Repositories/Cache";
import { ScraperDatabaseRepository } from "./Repositories/Database";
import Product from "./Models/Product";
import { ProductDto } from "./Dtos/Product";
import { Parser } from "Api/SharedResources/Utils/Parser";
import { RequestsService } from "Api/SharedResources/Utils/Request";

@Injectable()
export class ScraperService {
  constructor(
    private readonly scraperCacheRepository: ScraperCacheRepository,
    private readonly scraperDatabaseRepository: ScraperDatabaseRepository,
    private readonly requests: RequestsService
  ) {}

  async getProduct(productDto: ProductDto): Promise<Product> {
    const cachedProduct = await
      this.scraperCacheRepository.find(productDto.url);

    if (cachedProduct)
      return plainToClass(Product, cachedProduct);

    const request = await
      this.requests.get(productDto.url);

    const parsedProduct =
      plainToClass(Product, Parser.run(request.data));

    const databaseProduct = await this.scraperDatabaseRepository.createOrUpdate({
      ...parsedProduct, url: productDto.url });

    this.scraperCacheRepository.create(databaseProduct);

    return databaseProduct;
  }
}
