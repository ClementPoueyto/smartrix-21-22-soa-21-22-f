import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DistrictAutarkyDetectorController } from './district-autarky-detector.controller';
import { DistrictAutarkyDetectorService } from './district-autarky-detector.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DISTRICT_AUTARKY_DETECTOR_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'district-autarky-detector',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'district-autarky-detector-consumer'
          }
        }
      },
    ]),
  ],
  controllers: [DistrictAutarkyDetectorController],
  providers: [DistrictAutarkyDetectorService],
})
export class DistrictAutarkyDetectorModule { }
