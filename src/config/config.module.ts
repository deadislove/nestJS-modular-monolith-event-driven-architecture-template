import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Global() // Optional: make ConfigService globally available
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // No need to import again in other modules
      //load: [appConfig], // Load config factories
      envFilePath: '.env',
    }),
  ],
})
export class ConfigModule {}