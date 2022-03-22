import { NestFactory } from '@nestjs/core';
import { ProductionContractModule } from './production-contract.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductionContractModule);
  await app.listen(3016);
}
bootstrap();
