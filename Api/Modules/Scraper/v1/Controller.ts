import { Controller, Get, Query } from "@nestjs/common";
import { ProductDto } from "./Dtos/Product";
import Product from "./Models/Product";
import { ScraperService } from "./Service";

@Controller({ version: "1" })
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService
  ) {}

  @Get()
  getProduct(@Query() productDto: ProductDto): Promise<Product> {
    return this.scraperService.getProduct(productDto);
  }
}
