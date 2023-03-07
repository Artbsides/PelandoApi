import { ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { HttpExceptionHandler } from "Api/Exceptions/ExceptionHandler";

describe("ExceptionHandler", () => {
  const handler: HttpExceptionHandler = new HttpExceptionHandler();

  const host: any = {
    switchToHttp: () => ({
      getResponse: () => {
        return { json: jest.fn().mockReturnThis(), status: jest.fn().mockReturnThis() };
      }
    })
  };

  const env = process.env;

  beforeAll(() => (process.env = { ...env }));

  it("Should return void when exception exists", async () =>
    await expect(handler.catch(new NotFoundException(), host)).resolves.toBeUndefined());

  it("Should return void when exception doesn't exists", async () =>
    await expect(handler.catch(new ForbiddenException(), host)).resolves.toBeUndefined());

  it("Should return void with a different environment", async () => {
    process.env.NODE_ENV = "development";

    await expect(handler.catch(new InternalServerErrorException(), host)).resolves.toBeUndefined();
  });

  afterAll(() => (process.env = env));
});
