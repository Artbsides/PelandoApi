import { Exclude } from "@nestjs/class-transformer";
import { Products } from "@prisma/client";

export default class Product implements Products {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  image: string | null;
  url: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
