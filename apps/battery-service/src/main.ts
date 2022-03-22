import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BatteryServiceModule } from './battery-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BatteryServiceModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'battery-service',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'battery-service-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3012);
}
bootstrap();
