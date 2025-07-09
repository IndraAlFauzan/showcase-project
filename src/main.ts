import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Interceptor response standar
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

  // Global exception filter
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hapus properti yang tidak didefinisikan di DTO
      forbidNonWhitelisted: true, // lempar error kalau ada properti asing
      transform: true, // otomatis konversi ke tipe DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
