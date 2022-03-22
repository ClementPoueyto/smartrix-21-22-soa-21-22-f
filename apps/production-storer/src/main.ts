import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductionStorerModule } from './production-storer.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductionStorerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'production-storer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'production-storer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3013);
}
bootstrap();
