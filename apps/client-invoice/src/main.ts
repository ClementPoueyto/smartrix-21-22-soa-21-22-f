import { NestFactory } from '@nestjs/core';
import { ClientInvoiceModule } from './client-invoice.module';

async function bootstrap() {
  const app = await NestFactory.create(ClientInvoiceModule);

  await app.listen(3009);
}
bootstrap();
