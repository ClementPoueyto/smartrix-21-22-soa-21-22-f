import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DistrictAutarkyNotifierModule } from './district-autarky-notifier.module';

async function bootstrap() {
  const app = await NestFactory.create(DistrictAutarkyNotifierModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'district-autarky-notifier',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'district-autarky-notifier-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3025);
}
bootstrap();
