import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FiveMinAutarkyAggregatorModule } from './five-min-autarky-aggregator.module';

async function bootstrap() {
  const app = await NestFactory.create(FiveMinAutarkyAggregatorModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'five-min-autarky-aggregator',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'five-min-autarky-aggregator-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3018);
}
bootstrap();
