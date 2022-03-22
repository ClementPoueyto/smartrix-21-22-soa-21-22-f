import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HourConsumption,
  HourConsumptionDocument,
  HourConsumptionSchema,
} from 'apps/schema/hour-consumption.schema';
import { ConsumptionStorerController } from './consumption-storer.controller';
import { ConsumptionStorerService } from './consumption-storer.service';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'HOUR_STORER_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'consumption-storer',
          brokers: ['kafka:29092'],
        },
        consumer: {
          groupId: 'consumption-storer-consumer'
        }
      }
    },
  ]),
    MongooseModule.forRoot(
      process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
    ),
    MongooseModule.forFeature([{ name: HourConsumption.name, schema: HourConsumptionSchema }])
  ],
  controllers: [ConsumptionStorerController],
  providers: [ConsumptionStorerService],
})
export class ConsumptionStorerModule { }
