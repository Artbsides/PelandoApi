import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionHandler implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    exception = await import(`./Throws/${exception.name}`)
      .then(() => eval(`new e.${exception.name}()`))
      .catch(() => exception);

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(exception.getStatus())
      .json({
        id: randomUUID(),
        error: {
          message: exception.message,
          ...(process.env.NODE_ENV === "development" && {
            trace: exception.stack
          })
        }
      });
  }
}
