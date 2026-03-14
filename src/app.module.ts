import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getConfig } from "./config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";


@Module({
  imports: [
    ConfigModule.forRoot({ load: [getConfig], isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
