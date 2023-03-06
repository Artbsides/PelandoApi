import { FakerProduct } from "ApiTests/Faker/Modules/Scraper/v1/Models/Product";
import { AxiosResponse } from "axios";
import * as jwt from 'jsonwebtoken';
import { Algorithm } from 'jsonwebtoken';

export class FakerRequestsService {
  static url: string =
    FakerProduct.product.url;

  static html: string[] = [
    "<div>",
      `<h1 class='class-name-x-product-title'>${ FakerProduct.product.title }</h1>`,
      `<span class='class-name-Price__value'>${ FakerProduct.product.price }</span>`,
      `<img class='class-name-x-productImageTag' src='${ FakerProduct.product.image }' />`,
      `<div class='class-name-x-product-description__text'>${ FakerProduct.product.description }</div>`,
    "</div>"
  ];

  static response: AxiosResponse = {
    data: this.html.join(""),
    headers: {},
    status: 200,
    statusText: "OK",
    config: {
      url: this.url,
      headers: {} as any
    }
  };

  static headers(): Record<string, string> {
    return {
      ApiVersion: "1",
      Authorization: `Bearer ${jwt.sign({}, process.env.JWT_SECRET!, {
        algorithm: process.env.JWT_ALGORITHM as Algorithm, expiresIn: 3000
      })}`
    }
  };
}
