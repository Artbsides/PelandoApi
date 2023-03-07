import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ScraperException } from "Api/Exceptions/Throws/ScraperException";
import { AxiosResponse } from "axios";
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
export class RequestsService {
  constructor(
    private readonly httpService: HttpService
  ) {}

  async get(url: string): Promise<AxiosResponse> {
    return await firstValueFrom(
      this.httpService.get(url).pipe(catchError(() => {
        throw new ScraperException();
      })
    ));
  }
}
