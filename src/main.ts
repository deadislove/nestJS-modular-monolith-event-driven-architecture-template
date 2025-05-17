import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResposneInterceptor } from '@common/interceptors/response.interceptor';
import { AllExceptionsFilter } from '@common/filters/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResposneInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
