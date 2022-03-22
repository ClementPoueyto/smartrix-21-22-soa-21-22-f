import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientAutarkyDetectorController } from './client-autarky-detector.controller';
import { ClientAutarkyDetectorService } from './client-autarky-detector.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_AUTARKY_DETECTOR_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'client-autarky-detector',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'client-autarky-detector-consumer'
          }
        }
      },
    ]),
  ],
  controllers: [ClientAutarkyDetectorController],
  providers: [ClientAutarkyDetectorService],
})
export class ClientAutarkyDetectorModule { }
