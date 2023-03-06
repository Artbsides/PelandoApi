import { HttpModule, HttpService } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { ScraperException } from "Api/Exceptions/Throws/ScraperException";
import { RequestsService } from "Api/SharedResources/Utils/Request";
import { FakerRequestsService } from "ApiTests/Faker/SharedResources/Utils/Requests";
import { AxiosError } from "axios";
import { of, throwError } from "rxjs";

describe("RequestsService", () => {
  const data = {
    url: FakerRequestsService.url,
    html: FakerRequestsService.html.join(""),
    response: FakerRequestsService.response
  };

  let httpService: HttpService;
  let requestsService: RequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        RequestsService
      ]
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    requestsService = module.get<RequestsService>(RequestsService);
  });

  it("Should return a html content", async () => {
    jest.spyOn(httpService, "get")
      .mockImplementationOnce(() => of(data.response));

    const request = await
      requestsService.get(data.url);

    expect(request.data).toStrictEqual(data.html);
  });

  it("Should return an exception", async () => {
    jest.spyOn(httpService, "get")
      .mockImplementationOnce(() => throwError(() => AxiosError));

    expect(async () => {
      await requestsService.get(data.url) }).rejects.toThrow(ScraperException);
  });
});
