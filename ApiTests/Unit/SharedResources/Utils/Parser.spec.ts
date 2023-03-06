import { Parser } from "Api/SharedResources/Utils/Parser";
import { FakerParser } from "ApiTests/Faker/SharedResources/Utils/Parser";
import { FakerRequestsService } from "ApiTests/Faker/SharedResources/Utils/Requests";

describe("Parser", () => {
  const data = {
    html: FakerRequestsService.html,
    product: FakerParser.parser
  };

  it("Should return a complete ParseType oject", () =>
    expect(Parser.run(data.html.join(""))).toStrictEqual(data.product));

  it("Should return a partial ParseType oject", () => {
    delete data.html[3];
    delete data.html[4];

    expect(Parser.run(data.html.join(""))).toStrictEqual({
      ...data.product, image: "", description: "" });
  });
});
