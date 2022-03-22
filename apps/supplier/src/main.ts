import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SupplierModule } from './supplier.module';

async function bootstrap() {
  const app = await NestFactory.create(SupplierModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'supplier',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'supplier-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
