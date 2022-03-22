import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumptionStorerModule } from './consumption-storer.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumptionStorerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'consumption-storer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'consumption-storer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
