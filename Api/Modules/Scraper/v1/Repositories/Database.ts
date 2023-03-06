import { classToPlain } from "@nestjs/class-transformer";
import { Injectable } from "@nestjs/common";
import { Products } from "@prisma/client";
import { PrismaService } from "Api/Confs/Database";
import Product from "../Models/Product";

@Injectable()
export class ScraperDatabaseRepository {
  constructor(
    private prisma: PrismaService
  ) {}

  async createOrUpdate(product: Product): Promise<Products> {
    return await this.prisma.products.upsert({
      where: {
        url: product.url
      },
      update: classToPlain(product),
      create: product
    });
  }
}
