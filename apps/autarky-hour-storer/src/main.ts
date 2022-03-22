import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AutarkyHourStorerModule } from './autarky-hour-storer.module';

async function bootstrap() {
  const app = await NestFactory.create(AutarkyHourStorerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'autarky-hour-storer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'autarky-hour-storer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3020);
}
bootstrap();
