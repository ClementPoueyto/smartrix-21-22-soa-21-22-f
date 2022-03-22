import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductionRequesterModule } from './production-requester.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductionRequesterModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'production-requester',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'production-requester-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3010);
}
bootstrap();
