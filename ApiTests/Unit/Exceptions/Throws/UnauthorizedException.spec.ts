import { HttpStatus } from "@nestjs/common";
import { UnauthorizedException } from "Api/Exceptions/Throws/UnauthorizedException";

describe("UnauthorizedException", () => {
  it("Should return an exception", () => {
    const exception: UnauthorizedException =
      new UnauthorizedException();

    expect(exception.name).not.toBe("");
    expect(exception.message).not.toBe("");
    expect(exception.stack).not.toBe("");

    expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
  });

  it("Should return an exception with custom message", () =>
    expect(new UnauthorizedException("Lorem").message).toBe("Lorem"));
});
