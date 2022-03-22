import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'HOUSE_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'house',
          brokers: ['kafka:29092'],
        },
        consumer: {
          groupId: 'house-consumer'
        }
      }
    },
  ]),],
  controllers: [HouseController],
  providers: [HouseService],
})
export class HouseModule { }
