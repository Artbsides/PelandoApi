import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Docs } from "./Confs/Docs";
import { HttpExceptionHandler } from "./Exceptions/ExceptionHandler";
import { AppModule } from "./Module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionHandler());

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: "ApiVersion"
  });

  if (process.env.NODE_ENV != "production") Docs.useSwagger(app);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(Number(process.env.NODE_PORT), process.env.NODE_HOST as string);
}

bootstrap();
