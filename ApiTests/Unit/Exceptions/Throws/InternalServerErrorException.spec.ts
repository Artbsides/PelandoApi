import { HttpStatus } from "@nestjs/common";
import { InternalServerErrorException } from "Api/Exceptions/Throws/InternalServerErrorException";

describe("InternalServerErrorException", () => {
  it("Should return an exception", () => {
    const exception: InternalServerErrorException =
      new InternalServerErrorException();

    expect(exception.name).not.toBe("");
    expect(exception.message).not.toBe("");
    expect(exception.stack).not.toBe("");

    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it("Should return an exception with custom message", () =>
    expect(new InternalServerErrorException("Lorem").message).toBe("Lorem"));
});
