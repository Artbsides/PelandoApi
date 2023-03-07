import { faker } from "@faker-js/faker";
import Product from "Api/Modules/Scraper/v1/Models/Product";

export class FakerProduct {
  static product: Product = {
    id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    price: faker.commerce.price(1, 999, 2, "R$ ").replace(".", ","),
    image: faker.image.imageUrl(),
    description: faker.commerce.productDescription(),
    url: faker.internet.url(),
    created_at: faker.date.past(),
    updated_at: faker.date.future()
  };
}
