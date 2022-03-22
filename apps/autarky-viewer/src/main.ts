import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AutarkyViewerModule } from './autarky-viewer.module';

async function bootstrap() {
  const app = await NestFactory.create(AutarkyViewerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'autarky-viewer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'autarky-viewer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3023);
}
bootstrap();
