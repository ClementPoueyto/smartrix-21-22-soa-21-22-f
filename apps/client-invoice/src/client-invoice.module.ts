import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientInvoice, ClientInvoiceDocument, ClientInvoiceSchema } from 'apps/schema/client-invoice.schema';
import { ClientInvoiceController } from './client-invoice.controller';
import { ClientInvoiceService } from './client-invoice.service';

@Module({
  imports: [HttpModule,
    MongooseModule.forRoot(
      process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/nest',
    ),
    MongooseModule.forFeature([{ name: ClientInvoice.name, schema: ClientInvoiceSchema }])
  ],
  controllers: [ClientInvoiceController],
  providers: [ClientInvoiceService],
})
export class ClientInvoiceModule {}
