import { CACHE_MODULE_OPTIONS, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "Api/Confs/Database";
import { Docs } from "Api/Confs/Docs";
import { AppModule } from "Api/Module";

describe("Docs", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ]
    })
    .overrideProvider(PrismaService)
    .useValue({})
    .overrideProvider(CACHE_MODULE_OPTIONS)
    .useValue({})
    .compile();

    app = await module
      .createNestApplication().init();
  });

  describe("useSwagger", () => {
    it("Should return void without errors", async () => {
      expect(Docs.useSwagger(app)).toBeUndefined();
    });
  });
});
