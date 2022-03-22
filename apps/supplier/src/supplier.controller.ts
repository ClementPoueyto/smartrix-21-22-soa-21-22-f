import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductioRequestDto } from './dto/production-request.dto';
import { ProductionDto } from './dto/production.dto';
import { SupplierService } from './supplier.service';

@Controller()
export class SupplierController {
  private readonly LAP_TIME = 2000;
  private mode: "REAL_TIME" | "MOCK" = "MOCK";
  private timestamp: Date = undefined;

  constructor(@Inject('SUPPLIER_SERVICE') private readonly client: ClientKafka, private readonly supplierService: SupplierService) {
    this.exec();
    this.infiniteExec();
  }

  private async exec() {
    this.supplierService.produce(this.client);
  }

  private async infiniteExec() {
    while (this.mode === "REAL_TIME") {
      this.exec();
      await new Promise(r => setTimeout(r, this.LAP_TIME));
    }
  }

  @MessagePattern('energy.less.requested')
  async lessEnergyRequested(@Payload() message) {
    this.supplierService.produceLess(new ProductioRequestDto(message.value));
  }

  @MessagePattern('energy.more.requested')
  async moreEnergyRequested(@Payload() message) {
    console.log(message.value)
    this.supplierService.produceMore(new ProductioRequestDto(message.value));
  }

  @MessagePattern('mock.time.changed')
  async mockTimeChanged(@Payload() message) {
    let date = new Date(message.value.timestamp);

    if (this.timestamp === undefined) {
      this.exec();
      this.timestamp = date;
    }

    let delta = date.valueOf() - this.timestamp.valueOf();

    if (delta >= this.LAP_TIME) {
      this.exec();
      this.timestamp = date;
    }
  }
  @Post('produce')
  async produce(produce: ProductionDto){
    this.client.emit('energy.produced', JSON.stringify(produce));
  }

  @Post('/mode')
  async changeMode(@Body() body: { mode: "REAL_TIME" | "MOCK" }) {
    this.mode = body.mode;
    if (this.mode === "REAL_TIME")
      this.infiniteExec();
  }
}
