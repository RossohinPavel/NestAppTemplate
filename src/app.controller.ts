import { TypedRoute } from "@nestia/core";
import { AppService } from "./app.service";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('App')
@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  /**
   * @summary Пингуем сервис.
   * @returns pong
   */
  @TypedRoute.Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
