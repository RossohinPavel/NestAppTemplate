import { Logger } from "@nestjs/common";


type LogLevels = "log" | "warn" | "error";

export class MyLogger extends Logger {

  private static COLORS = {
    white: "\x1b[37m",
    log: "\x1b[32m",   // Зеленый
    warn: "\x1b[33m",  // Оранжевый (желтый в терминале)
    error: "\x1b[31m", // Красный
    reset: "\x1b[0m",   // Сброс цвета
  } as const;

  private static LOG_SERVICE_URL = process.env.LOGGER_SERVICE_URL;

  public quietHttp: boolean;

  constructor(context: string, options?: { quietHttp?: boolean, timestamp?: boolean }) {
    super(context, options);
    this.quietHttp = options?.quietHttp || true;
  }

  /**
   * Отправляет лог-сообщение на внешний сервис логирования.
   * @param level - Уровень лога ('log', 'warn', 'error').
   * @param message - Основное сообщение для отправки.
   * @param rest - Дополнительные данные, которые будут включены в лог.
   */
  private async sendLog(level: LogLevels, message: string, rest: unknown) {
    let result: unknown;
    try {
      const content = { message } as Record<string, unknown>;
      if (rest !== undefined) {
        content.rest = rest;
      }
      const toSend = { type: level, context: this.context, content };
      const body = JSON.stringify(toSend);
      const response = await fetch(MyLogger.LOG_SERVICE_URL!, { 
        method: "POST", 
        body, 
        signal: AbortSignal.timeout(3000),
      });
      result = `${response.status}: ${response.statusText}`;
    } catch (e) {
      result = (e as Error).message;
    }
    if (!this.quietHttp) {
      console.info(result);
    }
  }

  /**
   * Обрабатывает лог-сообщение: подготавливает данные для отправки на сервис и формирует строку 
   * для вывода в консоль.
   * @param level - Уровень лога ('log', 'warn', 'error').
   * @param message - Основное сообщение для логирования.
   * @param rest - Массив дополнительных данных.
   * @returns Кортеж из отформатированного сообщения для консоли и дополнительных данных.
   */
  private handleLog(level: LogLevels, message: string, rest?: unknown[]) {
    let content: unknown = undefined;
    if (rest !== undefined && rest.length === 1) {
      content = rest[0];
    }
    if (MyLogger.LOG_SERVICE_URL !== undefined) {
      void this.sendLog(level, message, content);
    }
    const now = (new Date()).toISOString();
    const coloredLevel = `${MyLogger.COLORS[level]}${level.toUpperCase()}${MyLogger.COLORS.reset}`;
    const context = `${MyLogger.COLORS.white}${this.context}${MyLogger.COLORS.reset}`;
    return [`${now} ${coloredLevel}: ${context}: ${message}`, content] as const;
  }

  /**
   * Логирует ответ от сервера.
   * @param message - Сообщение об ответе сервера.
   */
  onResponse(message: string) {
    this.handleLog("log", message);
    super.log(message);
  }

  /**
   * Логирует информационное сообщение.
   * @param message - Основное сообщение для логирования.
   * @param rest - Дополнительные данные или объекты для вывода в консоль.
   */
  log(message: string, ...rest: unknown[]): void {
    const [msg, content] = this.handleLog("log", message, rest);
    this.toConsole(msg, content);;
  }

  /**
   * Логирует предупреждающее сообщение.
   * @param message - Предупреждающее сообщение для логирования.
   * @param rest - Дополнительные данные или объекты для вывода в консоль.
   */
  warn(message: string, ...rest: unknown[]): void {
    const [msg, content] = this.handleLog("warn", message, rest);
    this.toConsole(msg, content);
  }

  /**
   * Логирует сообщение для ошибки.
   * @param message - Ошибка.
   * @param rest - Дополнительные данные или объекты для вывода в консоль.
   */
  error(message: Error, ...rest: unknown[]): void {
    if (rest === undefined) {
      rest = [];
    };
    rest.push({ message: message.message, stack: message.stack, name: message.name });
    const [msg, content] = this.handleLog("error", message.message, rest);
    this.toConsole(msg, content);;
  }

  /**
   * Непосредственно выводи сообщение в консоль
   * @param message - Предупреждающее сообщение для логирования.
   * @param content - Некоторый объект, который мог быть передан в функции логгирования.
   */
  private toConsole(message: string, content: unknown) {
    console.info(message);
    if (content !== undefined) {
      console.info(content);
    }
  }

}
