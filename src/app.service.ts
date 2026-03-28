import { ConfigType } from "./config";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AppService {

  constructor(private readonly config: ConfigService<ConfigType>) {}

  getPong(): string {
    return "pong";
  }

  getBackendPort(): number {
    // Можно утверждать, что значение тут всегда есть.
    return this.config.get("backendPort")!;
  }

}
