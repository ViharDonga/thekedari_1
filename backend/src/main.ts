import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;
  const extraOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.endsWith('.onrender.com')) return callback(null, true);
      if (origin === 'http://localhost:4200') return callback(null, true);
      if (frontendUrl && origin === frontendUrl) return callback(null, true);
      if (extraOrigins.includes(origin)) return callback(null, true);
      if (!frontendUrl && process.env.NODE_ENV !== 'production') return callback(null, true);
      callback(null, false);
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
}
bootstrap();
