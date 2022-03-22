import { Module } from '@nestjs/common';
import { ConsumptionRequestedListenerController } from './consumption-requested-listener.controller';
import { ConsumptionRequestedListenerService } from './consumption-requested-listener.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FutureConsumption,
  FutureConsumptionDocument,
  FutureConsumptionSchema,
} from '../../schema/future-consumption.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'CR_LISTENER_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'cr_listener',
          brokers: ['kafka:29092'],
        },
        consumer: {
          groupId: 'cr_listener-consumer'
        }
      }
    },
  ]), 
  MongooseModule.forRoot(
    process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
  ),
  MongooseModule.forFeature([{ name: FutureConsumption.name, schema: FutureConsumptionSchema }]), HttpModule],
  controllers: [ConsumptionRequestedListenerController],
  providers: [ConsumptionRequestedListenerService],
})
export class ConsumptionRequestedListenerModule { }
