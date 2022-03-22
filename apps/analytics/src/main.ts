import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AnalyticsModule } from './analytics.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsModule);
  const config = new DocumentBuilder()
    .setTitle('Analytics')
    .setDescription('The Analytics API description')
    .setVersion('1.0')
    .addTag('analytics')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/analytics', app, document);
  await app.listen(3005);
}
bootstrap();
