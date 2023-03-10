import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER, CACHE_MODULE_OPTIONS, INestApplication } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "Api/Module";
import { HttpStatusCode } from "axios";
import { of } from "rxjs";
import * as request from "supertest";
import { PrismaService } from "Api/Confs/Database";
import { FakerRequestsService } from "ApiTests/Faker/SharedResources/Utils/Requests";
import { FakerProduct } from "ApiTests/Faker/Modules/Scraper/v1/Models/Product";

describe("Scraper", () => {
  const data = {
    url: FakerRequestsService.url,
    html: FakerRequestsService.html.join(""),
    headers: FakerRequestsService.headers(),
    response: FakerRequestsService.response,
    product: FakerProduct.product
  };

  const { ...product }: any = data.product;

  let app: INestApplication;

  let cacheManager: Cache;
  let prismaService: PrismaService;
  let httpService: HttpService;

  beforeAll(async () => {
    delete product.created_at;
    delete product.updated_at;

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(PrismaService)
      .useValue({
        products: {
          upsert: () => null,
          findFirst: () => null
        }
      })
      .overrideProvider(CACHE_MODULE_OPTIONS)
      .useValue({})
      .compile();

    app = await module.createNestApplication().init();

    cacheManager = module.get<Cache>(CACHE_MANAGER);
    prismaService = module.get<PrismaService>(PrismaService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("/ (GET) from cache", done => {
    jest.spyOn(cacheManager, "get").mockImplementationOnce(async () => data.product);

    request(app.getHttpServer())
      .get("/")
      .query({ url: data.url })
      .set(data.headers)
      .end((_, response) => {
        expect(response.body).toStrictEqual(product);
        expect(response.status).toBe(HttpStatusCode.Ok);

        done();
      });
  });

  it("/ (GET) from database", done => {
    jest.spyOn(httpService, "get").mockImplementationOnce(() => of(data.response));

    prismaService.products.findFirst = jest.fn().mockReturnValueOnce(data.product);

    request(app.getHttpServer())
      .get("/")
      .query({ url: data.url })
      .set(data.headers)
      .end((_, response) => {
        expect(response.body).toStrictEqual(product);
        expect(response.status).toBe(HttpStatusCode.Ok);

        done();
      });
  });

  it("/ (GET) from external url", done => {
    jest.spyOn(httpService, "get").mockImplementationOnce(() => of(data.response));

    prismaService.products.upsert = jest.fn().mockReturnValueOnce(data.product);

    request(app.getHttpServer())
      .get("/")
      .query({ url: data.url })
      .set(data.headers)
      .end((_, response) => {
        expect(response.body).toStrictEqual(product);
        expect(response.status).toBe(HttpStatusCode.Ok);

        done();
      });
  });
});
