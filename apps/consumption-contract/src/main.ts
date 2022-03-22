import { NestFactory } from '@nestjs/core';
import { ConsumptionContractModule } from './consumption-contract.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumptionContractModule);
  await app.listen(3008);
}
bootstrap();
