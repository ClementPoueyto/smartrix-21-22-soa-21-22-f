import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SUPPLIER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'supplier',
            brokers: ['kafka:29092']
          },
          consumer: {
            groupId: 'supplier-consumer'
          }
        }
      }
    ])
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule { }
