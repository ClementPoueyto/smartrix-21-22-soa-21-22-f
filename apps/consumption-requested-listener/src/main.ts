import { NestFactory } from '@nestjs/core';
import { ConsumptionRequestedListenerModule } from './consumption-requested-listener.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ConsumptionRequestedListenerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'consumption-requested-listener',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'consumption-requested-listener-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3007);
}
bootstrap();
