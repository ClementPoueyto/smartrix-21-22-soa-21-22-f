import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DistrictAutarkyDetectorModule } from './district-autarky-detector.module';

async function bootstrap() {
  const app = await NestFactory.create(DistrictAutarkyDetectorModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'district-autarky-detector',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'district-autarky-detector-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3024);
}
bootstrap();
