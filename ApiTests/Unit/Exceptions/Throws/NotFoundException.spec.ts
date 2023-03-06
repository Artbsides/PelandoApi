import { HttpStatus } from "@nestjs/common";
import { NotFoundException } from "Api/Exceptions/Throws/NotFoundException";

describe("NotFoundException", () => {
  it("Should return an exception", () => {
    const exception: NotFoundException =
      new NotFoundException();

    expect(exception.name).not.toBe("");
    expect(exception.message).not.toBe("");
    expect(exception.stack).not.toBe("");

    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });

  it("Should return an exception with custom message", () =>
    expect(new NotFoundException("Lorem").message).toBe("Lorem"));
});
