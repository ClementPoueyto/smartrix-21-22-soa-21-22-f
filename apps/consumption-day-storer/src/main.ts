import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumptionDayStorerModule } from './consumption-day-storer.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumptionDayStorerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'consumption-day-storer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'consumption-day-storer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3015);
}
bootstrap();
