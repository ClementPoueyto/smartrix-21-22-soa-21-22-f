import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ClientAutarkyDetectorModule } from './client-autarky-detector.module';

async function bootstrap() {
  const app = await NestFactory.create(ClientAutarkyDetectorModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'client-autarky-detector',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'client-autarky-detector-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3017);
}
bootstrap();
