import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export class Docs {
  private static token = {
    type: "http",
    scheme: "Bearer",
    bearerFormat: "JWT",
    description:
      "Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEyMzQ1Njc4OTB9.rW63NxIHJOl-kZcgEy79Jn04CXshC7kubUkzqcdL0Ac<br /><br />"
  };

  static useSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle("PeloandoApi")
      .setDescription("C&A store product crawler")
      .setVersion("0.0.1")
      .addBearerAuth(this.token as SecuritySchemeObject, "Authorization")
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("docs", app, document);
  }
}
