import { ParserType } from "Api/SharedResources/Types/Parser";
import { FakerProduct } from "ApiTests/Faker/Modules/Scraper/v1/Models/Product";

export class FakerParser {
  static parser: ParserType = {
    title: FakerProduct.product.title,
    price: FakerProduct.product.price as string,
    image: FakerProduct.product.image as string,
    description: FakerProduct.product.description as string
  };
}
