import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductionRequesterController } from './production-requester.controller';
import { ProductionRequesterService } from './production-requester.service';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'PRODUCTION_REQUESTER_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'production-requester',
          brokers: ['kafka:29092'],
        },
        consumer: {
          groupId: 'production-requester-consumer'
        }
      }
    },
  ]),],
  controllers: [ProductionRequesterController],
  providers: [ProductionRequesterService],
})
export class ProductionRequesterModule { }
