import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BalancerController } from './balancer.controller';
import { BalancerService } from './balancer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BALANCER_SERVICE',
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
      },
    ]),
  ],
  controllers: [BalancerController],
  providers: [BalancerService],
})
export class BalancerModule { }
