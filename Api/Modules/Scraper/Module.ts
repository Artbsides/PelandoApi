import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PrismaService } from "Api/Confs/Database";
import { RequestsService } from "Api/SharedResources/Utils/Request";
import { ScraperController } from "./v1/Controller";
import { ScraperCacheRepository } from "./v1/Repositories/Cache";
import { ScraperDatabaseRepository } from "./v1/Repositories/Database";
import { ScraperService } from "./v1/Service";

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000
    })
  ],
  controllers: [
    ScraperController
  ],
  providers: [
    ScraperService,
    ScraperCacheRepository,
    ScraperDatabaseRepository,
    RequestsService,
    PrismaService
  ]
})
export class ScraperModule {}
