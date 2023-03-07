import { HttpStatus } from "@nestjs/common";
import { ScraperException } from "Api/Exceptions/Throws/ScraperException";

describe("ScraperException", () => {
  it("Should return an exception", () => {
    const exception: ScraperException = new ScraperException();

    expect(exception.name).not.toBe("");
    expect(exception.message).not.toBe("");
    expect(exception.stack).not.toBe("");

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it("Should return an exception with custom message", () =>
    expect(new ScraperException("Lorem").message).toBe("Lorem"));
});
