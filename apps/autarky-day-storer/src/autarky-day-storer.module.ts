import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientDayAutarky, ClientDayAutarkySchema } from 'apps/schema/day-client-autarky.schema';
import { DistrictDayAutarky, DistrictDayAutarkySchema } from 'apps/schema/day-district-autarky.schema';
import { AutarkyDayStorerController } from './autarky-day-storer.controller';
import { AutarkyDayStorerService } from './autarky-day-storer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTARKY_DAY_STORER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'autarky_day_storer',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'autarky_day_storer-consumer'
          }
        }
      },
    ]),
    MongooseModule.forRoot(
      process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
    ),
    MongooseModule.forFeature([
      { name: ClientDayAutarky.name, schema: ClientDayAutarkySchema },
      { name: DistrictDayAutarky.name, schema: DistrictDayAutarkySchema }
    ])
  ],
  controllers: [AutarkyDayStorerController],
  providers: [AutarkyDayStorerService],
})
export class AutarkyDayStorerModule { }
