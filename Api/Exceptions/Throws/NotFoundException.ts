import { HttpException, HttpStatus } from "@nestjs/common";

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || "Resource not found or deprecated", HttpStatus.NOT_FOUND);
  }
}
