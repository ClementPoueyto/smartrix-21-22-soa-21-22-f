import { Module } from '@nestjs/common';
import { ConsumptionRequesterController } from './consumption-requester.controller';
import { ConsumptionRequesterService } from './consumption-requester.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FutureConsumption,
  FutureConsumptionDocument,
  FutureConsumptionSchema,
} from '../../schema/future-consumption.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
    ),
    MongooseModule.forFeature([{ name: FutureConsumption.name, schema: FutureConsumptionSchema }]),
    ClientsModule.register([
      {
        name: 'CONSUMPTION_REQUESTED_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'consumption-requester',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'consumption-requester-consumer',
          },
        },
      },
    ]),
    HttpModule,
  ],
  controllers: [ConsumptionRequesterController],
  providers: [ConsumptionRequesterService],
})
export class ConsumptionRequesterModule { }
