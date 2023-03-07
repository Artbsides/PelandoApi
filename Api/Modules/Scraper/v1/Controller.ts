import { plainToClass } from "@nestjs/class-transformer";
import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ProductDto } from "./Dtos/Product";
import Product from "./Models/Product";
import { ScraperService } from "./Service";

@Controller({ version: "1" })
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService
  ) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getProduct(@Query() productDto: ProductDto): Promise<Product> {
    return plainToClass(Product, await this.scraperService.getProduct(productDto));
  }
}
