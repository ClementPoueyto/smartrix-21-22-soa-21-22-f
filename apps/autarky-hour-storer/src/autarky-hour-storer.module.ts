import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientHourAutarky, ClientHourAutarkySchema } from 'apps/schema/hour-client-autarky.schema';
import { DistrictHourAutarky, DistrictHourAutarkySchema } from 'apps/schema/hour-district-autarky.schema';
import { AutarkyHourStorerController } from './autarky-hour-storer.controller';
import { AutarkyHourStorerService } from './autarky-hour-storer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTARKY_HOUR_STORER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'autarky_hour_storer',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'autarky_hour_storer-consumer'
          }
        }
      },
    ]),
    MongooseModule.forRoot(
      process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
    ),
    MongooseModule.forFeature([
      { name: ClientHourAutarky.name, schema: ClientHourAutarkySchema },
      { name: DistrictHourAutarky.name, schema: DistrictHourAutarkySchema }
    ])
  ],
  controllers: [AutarkyHourStorerController],
  providers: [AutarkyHourStorerService],
})
export class AutarkyHourStorerModule { }
