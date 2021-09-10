import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AppModule } from './app.module';
import { AuthService } from 'src/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const refAuthService = app.get<AuthService>(AuthService);

  app.useGlobalInterceptors(new TransformInterceptor(refAuthService));
  app.useGlobalFilters(new HttpExceptionFilter(refAuthService));
  app.setGlobalPrefix('api');
  await app.listen(7001);
}
bootstrap();
