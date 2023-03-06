import { HttpException, HttpStatus } from "@nestjs/common";

export class ScraperException extends HttpException {
  constructor(message?: string) {
    super(message || "Error scraping external services", HttpStatus.BAD_REQUEST);
  }
}
