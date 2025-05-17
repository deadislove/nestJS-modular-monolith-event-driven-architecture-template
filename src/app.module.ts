import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@config/config.module';
import { DataBaseModule } from '@infra/database/database.module';
import { LoggerModule } from '@infra/logger/logger.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { NotificationModule } from '@modules/notifications/notifications.module';
import { ProductModule } from '@modules/product/product.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DataBaseModule,
    NotificationModule,
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
