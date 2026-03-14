import { TypedRoute } from "@nestia/core";
import { AppService } from "./app.service";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

@ApiTags('App')
@Controller()
export class AppController {

  constructor(private readonly service: AppService) {}

  /**
   * @summary Пингуем сервис.
   * @returns pong
   */
  @TypedRoute.Get('/ping')
  getPing(): string {
    return this.service.getPing();
  }

}
