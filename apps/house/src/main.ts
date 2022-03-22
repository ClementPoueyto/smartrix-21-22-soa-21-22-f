import { NestFactory } from '@nestjs/core';
import { HouseModule } from './house.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(HouseModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'house',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'house-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
