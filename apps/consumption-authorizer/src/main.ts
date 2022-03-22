import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumptionAuthorizerModule } from './consumption-authorizer.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumptionAuthorizerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'consumption-authorizer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'consumption-authorizer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3022);
}
bootstrap();
