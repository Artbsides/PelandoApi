import { parse } from "node-html-parser";
import { ParserType } from "../Types/Parser";

export class Parser {
  static run(data: string): ParserType {
    const html =
      parse(data);

    const parser: ParserType = {
      title: [
        "h1",
        "x-product-title"
      ],
      price: [
        "span",
        "Price__value"
      ],
      image: [
        "img",
        "x-productImageTag"
      ],
      description: [
        "div",
        "x-product-description__text"
      ]
    }

    Object.entries(parser).forEach(([property, filters]) => {
      const value = html.getElementsByTagName(filters[0]).filter(tag => tag.attributes.class?.includes(filters[1]));

      parser[property] =
        (property === 'image' ? value[0]?.attributes.src : value[0]?.text) || '';
    });

    return parser;
  }
}
