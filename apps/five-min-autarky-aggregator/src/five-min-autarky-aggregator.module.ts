import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FiveMinAutarkyAggregatorController } from './five-min-autarky-aggregator.controller';
import { FiveMinAutarkyAggregatorService } from './five-min-autarky-aggregator.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FIVE_MIN_AUTARKY_AGGREGATOR_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'five-min-autarky-aggregator',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'five-min-autarky-aggregator-consumer'
          }
        }
      },
    ]),
  ],
  controllers: [FiveMinAutarkyAggregatorController],
  providers: [FiveMinAutarkyAggregatorService],
})
export class FiveMinAutarkyAggregatorModule { }
