import { Body, Controller, Get, Inject, Query, Post } from '@nestjs/common';
import { ConsumptionRequesterService } from './consumption-requester.service';
import { ClientKafka } from '@nestjs/microservices';
import { ConsumptionRequestedDto } from './dto/consumption-requested.dto';

@Controller()
export class ConsumptionRequesterController {
  constructor(@Inject('CONSUMPTION_REQUESTED_SERVICE') private readonly client: ClientKafka,
    private readonly consumptionRequesterService: ConsumptionRequesterService
  ) {this.exec()
  }

   async onModuleInit(){
     this.client.subscribeToResponseOf('car.charge.authorization');// un.topic.reply
     await this.client.connect();
   }
  @Get('car-charger-demand')
  async carChargingRequested(@Query('carBattery') carBattery:number,@Query('clientId') clientId:number,@Query('districtId') districtId:number){
    //this.consumptionRequesterService.chargeAuthorization(carBattery,clientId,districtId,this.client)
    return this.consumptionRequesterService.chargeAuthorization(carBattery,clientId,districtId,this.client)
  }
  @Get('futureconsumption')
  async energyRequested() {
    // while (true) {
    var consumptionsrequested = await this.consumptionRequesterService.getAllFutureConsumption()
    console.log(JSON.stringify(consumptionsrequested))
    return consumptionsrequested
    // for (var consumptionrequested of consumptionsrequested)
    //this.client.send('energy.requested', JSON.stringify(consumptionrequested));
    //  await new Promise(r => setTimeout(r, 5000));
    // }

  }

  @Post('futureconsumption')
  async createFconsumption(@Body() futureCosumptionDto: ConsumptionRequestedDto) {
    await this.consumptionRequesterService.createFconsumption(futureCosumptionDto);
    this.client.emit('energy.requested', JSON.stringify(futureCosumptionDto))

  }


  private async exec() {
    while (true) {
      this.consumptionRequesterService.ConsumeEnergyRequested(this.client);
      await new Promise(r => setTimeout(r, 20000));

      //3600000
    }
  }

  /*
    @Post()
    async getDroneItinerary(@Body() droneItinerary:DroneItinerary){
      //return this.appService.postItinerary(droneItinerary);
      this.client.emit('planning.update',JSON.stringify(droneItinerary.itinerary))
    }
   */





}
