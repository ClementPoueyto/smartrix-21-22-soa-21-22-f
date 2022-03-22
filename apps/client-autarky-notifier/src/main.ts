import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ClientAutarkyNotifierModule } from './client-autarky-notifier.module';

async function bootstrap() {
  const app = await NestFactory.create(ClientAutarkyNotifierModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'client-autarky-notifier',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'client-autarky-notifier-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3019);
}
bootstrap();
