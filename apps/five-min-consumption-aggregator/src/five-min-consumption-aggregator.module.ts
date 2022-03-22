import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FiveMinConsumptionAggregatorController } from './five-min-consumption-aggregator.controller';
import { FiveMinConsumptionAggregatorService } from './five-min-consumption-aggregator.service';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'FIVE_MIN_AGGREGATOR_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'five-min-aggregator',
          brokers: ['kafka:29092'],
        },
        consumer: {
          groupId: 'five-min-aggregator-consumer'
        }
      }
    },
  ]),],
  controllers: [FiveMinConsumptionAggregatorController],
  providers: [FiveMinConsumptionAggregatorService],
})
export class FiveMinConsumptionAggregatorModule {}
