import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumptionViewerModule } from './consumption-viewermodule';

async function bootstrap() {
  const app = await NestFactory.create(ConsumptionViewerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'consumption-viewer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'consumption-viewer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
