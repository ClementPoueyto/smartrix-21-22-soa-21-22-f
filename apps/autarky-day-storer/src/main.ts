import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AutarkyDayStorerModule } from './autarky-day-storer.module';

async function bootstrap() {
  const app = await NestFactory.create(AutarkyDayStorerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'autarky-day-storer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'autarky-day-storer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3021);
}
bootstrap();
