import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientAutarkyState, ClientAutarkyStateSchema } from 'apps/schema/client-autarky-state.schema';
import { ClientAutarkyNotifierController } from './client-autarky-notifier.controller';
import { ClientAutarkyNotifierService } from './client-autarky-notifier.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_AUTARKY_NOTIFIER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'client-autarky-notifier',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'client-autarky-notifier-consumer'
          }
        }
      },
    ]),
    MongooseModule.forRoot(
      process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
    ),
    MongooseModule.forFeature([{ name: ClientAutarkyState.name, schema: ClientAutarkyStateSchema }])
  ],
  controllers: [ClientAutarkyNotifierController],
  providers: [ClientAutarkyNotifierService],
})
export class ClientAutarkyNotifierModule { }
