import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BalancerModule } from './balancer.module';

async function bootstrap() {
  const app = await NestFactory.create(BalancerModule);
  const microservicekafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'balancer',
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'balancer-consumer'
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(3004);
}
bootstrap();
