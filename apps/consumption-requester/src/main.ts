import { NestFactory } from '@nestjs/core';
import { ConsumptionRequesterModule } from './consumption-requester.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumptionRequesterModule);
  await app.listen(3006);
}
bootstrap();
