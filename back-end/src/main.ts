import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOptions: CorsOptions = {
  origin: ['http://localhost:5173'], // Substitua pela(s) origem(s) permitida(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Ajuste os métodos HTTP permitidos
  credentials: true, // Configure 'true' se necessário para enviar cookies
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  await app.listen(3333);
}

bootstrap();
