import { IsNotEmpty, IsUrl } from "class-validator";

export class ProductDto {
  @IsNotEmpty()
  @IsUrl({
    require_host: true,
    require_protocol: true,

    protocols: [
      "http", "https"
    ]
  })
  url: string
}
