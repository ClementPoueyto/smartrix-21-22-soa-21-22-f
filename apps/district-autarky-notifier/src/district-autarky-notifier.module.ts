import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictAutarkyState, DistrictAutarkyStateSchema } from 'apps/schema/district-autarky-state.schema';
import { DistrictAutarkyNotifierController } from './district-autarky-notifier.controller';
import { DistrictAutarkyNotifierService } from './district-autarky-notifier.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DISTRICT_AUTARKY_NOTIFIER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'district-autarky-notifier',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'district-autarky-notifier-consumer'
          }
        }
      },
    ]),
    MongooseModule.forRoot(
      process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
    ),
    MongooseModule.forFeature([{ name: DistrictAutarkyState.name, schema: DistrictAutarkyStateSchema }])
  ],
  controllers: [DistrictAutarkyNotifierController],
  providers: [DistrictAutarkyNotifierService],
})
export class DistrictAutarkyNotifierModule { }
