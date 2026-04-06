import type { ConfigType } from "./config";
import { MyLogger } from "./logger";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AppService {

  private logger = new MyLogger(AppService.name);

  constructor(private readonly config: ConfigService<ConfigType>) {}

  getPong(): string {
    return "pong";
  }

  /**
   * Данный метод служит для демонстрации работы конфига и логгера.
   */
  someMethod(): void {
    // Получили значение из енв файла.
    this.config.getOrThrow("someSecret", { infer: true });
    // В логгере адаптировано 3 метода log, warn и error.
    // Можно обойтись обычным сообщением.
    this.logger.log("Some log message"); 
    // Можно отправить некоторый объект. Он будет выведен со следующей строки.
    this.logger.log("Some log message", { foo: "bar" }); 
    // Можно и несколько. Они будут объеденены в массив.
    this.logger.log("Some log message", { foo: "bar" }, 1); 
    // Аналогично работает метод warn/
    this.logger.warn("Some warn message", { foo: "bar", baz: "quz" });
    // Для ошибок лучше сразу передавать объект ошибки.
    this.logger.error(new Error("Too scary error"));
  }

}
