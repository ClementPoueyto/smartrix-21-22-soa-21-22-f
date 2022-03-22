import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FiveMinConsumptionAggregatorModule } from './five-min-consumption-aggregator.module';

async function bootstrap() {
  const app = await NestFactory.create(FiveMinConsumptionAggregatorModule);
  const microservicekafka  = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'five-min-aggregator',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'five-min-aggregator-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3014);
}
bootstrap();
