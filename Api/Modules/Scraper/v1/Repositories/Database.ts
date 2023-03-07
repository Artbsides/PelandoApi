import { classToPlain } from "@nestjs/class-transformer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "Api/Confs/Database";
import Product from "../Models/Product";

@Injectable()
export class ScraperDatabaseRepository {
  constructor(
    private prisma: PrismaService
  ) {}

  async find(url: string): Promise<Product | null> {
    return await this.prisma.products.findFirst({
      where: {
        url: url
      }
    });
  }

  async createOrUpdate(product: any): Promise<Product> {
    return await this.prisma.products.upsert({
      where: {
        url: product.url
      },
      update: classToPlain(product),
      create: product
    });
  }
}
