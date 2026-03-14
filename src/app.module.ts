import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Module } from "@nestjs/common";
import { getConfig } from "./config";


@Module({
  imports: [
    ConfigModule.forRoot({load: [getConfig], isGlobal: true})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
