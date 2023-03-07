import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard, JwtStrategy } from "./Confs/Authentication";
import { RedisModule } from "./Confs/Cache";
import { HttpExceptionHandler } from "./Exceptions/ExceptionHandler";
import { ScraperModule } from "./Modules/Scraper/Module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true
    }),
    RedisModule,
    ScraperModule

  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionHandler
    }
  ]
})
export class AppModule {}
