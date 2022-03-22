from datetime import datetime
import pandas as pd
from kafka import KafkaProducer
import json
import requests
import asyncio
import httpx
from consumers.autarkyConsumerProducer import AUTARKY, SEMI_AUTARKY, ConsumerProducer, DayProduction, DaySource
from consumers.consumer import OLD_PERSON, WORKER
from consumers.consumer import DayConsumption
from consumers.consumption import OutltetConsumptionType, Source

populationByDistrict = {
    1: 126,
    2: 230,
    3: 335,
    4: 406
}

typeRepresentation = {
    "oldPerson": 0.2,
    "worker": 0.6,
    "semiAutarhy": 0.13,
    "autarhy": 0.7,

}

now = datetime.now()
pastDay: datetime = now - pd.DateOffset(days=1)
pastWeek: datetime = now - pd.DateOffset(weeks=1)
pastTwoMonths: datetime = now - pd.DateOffset(months=3)
date: datetime = pastTwoMonths

print("now="+str(now))
print("pastDay="+str(pastDay))
print("pastWeek="+str(pastWeek))
print("pastTwoMonths="+str(pastTwoMonths))
print("date="+str(date))

producer = KafkaProducer(
    value_serializer=lambda v: json.dumps(v).encode('utf-8'))

beg_date: datetime = now - pd.DateOffset(years=1)
end_date: datetime = now + pd.DateOffset(years=3)
while True:
    try:
        requests.get('http://localhost:3008/consumptioncontract')
    except requests.ConnectionError:
        continue
    break


async def post_contrat(client, url, data):
    resp = await client.post(url, json=data)
    return resp


async def main():
    async with httpx.AsyncClient() as client:
        tasks = []
        for district in range(1, 5):
            for resident in range(0, populationByDistrict[district]):
                tasks.append(asyncio.ensure_future(post_contrat(client, 'http://localhost:3008/consumptioncontract', {'id': int(str(district)+str(resident)), 'idClient': int(str(district)+str(
                    resident)), 'districtId': district, 'beg_date': beg_date.__format__("%Y-%m-%dT%H:%M:%S.%fZ"), 'end_date': end_date.__format__("%Y-%m-%dT%H:%M:%S.%fZ"), 'price_KW': 0.1329})))
                if(resident > populationByDistrict[district] * (typeRepresentation["oldPerson"]+typeRepresentation["worker"])):
                    tasks.append(asyncio.ensure_future(post_contrat(client, 'http://localhost:3016/productioncontract', {'id': int(str(district)+str(resident)), 'idClient': int(str(district)+str(
                        resident)), 'districtId': district, 'beg_date': beg_date.__format__("%Y-%m-%dT%H:%M:%S.%fZ"), 'end_date': end_date.__format__("%Y-%m-%dT%H:%M:%S.%fZ"), 'price_KW': 0.1329})))
        print(len(tasks))
        req = await asyncio.gather(*tasks)


asyncio.run(main())
while date < now:
    offset = None
    # si on est dans les dernières 24h
    if date >= pastDay:
        # alors on augmente seconde par seconde
        offset = pd.DateOffset(minutes=5)
    # si on est dans la dernière semaine
    elif date >= pastWeek:
        # alors on augmente heure par heure
        offset = pd.DateOffset(hours=1)
    # sinon
    else:
        # on augmente jour par jour
        offset = pd.DateOffset(days=1)

    day = date.weekday()
    energy = None
    energyProd = None
    source = None
    destination = None
    dayProduction: DayProduction = None
    energyNonEssential = None
    daySource: DaySource = None
    dayDestination: DaySource = None
    dayConsumption: DayConsumption = None
    consumer = None
    id = 1
    # pour chaque district
    for district in populationByDistrict.keys():
        # pour chaque habitant
        for resident in range(0, populationByDistrict[district]):
            # on récupère son type

            if resident < populationByDistrict[district] * typeRepresentation["oldPerson"]:
                consumer = OLD_PERSON
            elif resident < populationByDistrict[district] * (typeRepresentation["oldPerson"]+typeRepresentation["worker"]):
                consumer = WORKER
            elif resident < populationByDistrict[district] * (typeRepresentation["oldPerson"]+typeRepresentation["worker"]+typeRepresentation["autarhy"]):
                consumer = AUTARKY
            else:
                consumer = SEMI_AUTARKY
            typeOfConsumer = type(consumer)
            # et on emit la bonne quantité d'energie
            if day < 5:
                dayConsumption = consumer.dayOfWeek
                if(typeOfConsumer is ConsumerProducer):
                    dayProduction = consumer.dayOfWeekProd
            elif day == 5:
                dayConsumption = consumer.saturday
                if(typeOfConsumer is ConsumerProducer):
                    dayProduction = consumer.saturdayProd
            else:
                dayConsumption = consumer.sunday
                if(typeOfConsumer is ConsumerProducer):
                    dayProduction = consumer.saturdayProd
            if(typeOfConsumer is ConsumerProducer):
                daySource = consumer.sourceCons
                dayDestination = consumer.destinationProd

            if offset == pd.DateOffset(minutes=5):
                energy = dayConsumption.getEssentialConsumption(date.hour) / 12
                energyNonEssential = dayConsumption.getNonEssentialConsumption(
                    date.hour)/12
                if(typeOfConsumer is ConsumerProducer):
                    energyProd = dayProduction.getProduction(date.hour) / 12
                    source = daySource.getSource(date.hour)
                    destination = dayDestination.getSource(date.hour)

            elif offset == pd.DateOffset(hours=1):
                energy = dayConsumption.getEssentialConsumption(date.hour)
                energyNonEssential = dayConsumption.getNonEssentialConsumption(
                    date.hour)
                if(typeOfConsumer is ConsumerProducer):
                    energyProd = dayProduction.getProduction(date.hour)
                    source = daySource.getSource(date.hour)
                    destination = dayDestination.getSource(date.hour)
            else:
                energy = dayConsumption.getTotalEssential()
                energyNonEssential = dayConsumption.getTotalNonEssential()
                if(typeOfConsumer is ConsumerProducer):
                    energyProd = dayProduction.getTotal()
                    source = Source.SOLAR
                    if(consumer is AUTARKY):
                        destination = Source.BATTERY
                    else:
                        destination = Source.GRID

            if(typeOfConsumer is not ConsumerProducer):
                producer.send('energy.consumed', {"timestamp": date.__format__("%Y-%m-%dT%H:%M:%S.%fZ"), "clientId": id, "districtId": district, "consumptionByOutlet": {
                    0: {"consumption": energy, "status": OutltetConsumptionType.ESSENTIAL.value},
                    1: {"consumption": energy, "status": OutltetConsumptionType.NONESSENTIAL.value},
                }, "source": Source.GRID.value})
            else:
                producer.send('energy.produced', {"timestamp": date.__format__("%Y-%m-%dT%H:%M:%S.%fZ"), "districtId": district, "production": energyProd,
                                                  "productorId": id, "supplierType": "CLIENT", "destination": destination.value})
                producer.send('energy.consumed', {"timestamp": date.__format__("%Y-%m-%dT%H:%M:%S.%fZ"), "clientId": id, "districtId": district, "consumptionByOutlet": {
                    0: {"consumption": energy, "status": OutltetConsumptionType.ESSENTIAL.value},
                    1: {"consumption": energy, "status": OutltetConsumptionType.NONESSENTIAL.value},
                }, "source": source.value})
            id = int(str(district)+str(resident)) 
    # quand on finit une boucle
    # on fait avancer dans le temps la balance et le supplier
    producer.send('mock.time.changed', {
                  "timestamp": date.__format__("%Y-%m-%dT%H:%M:%S.%fZ")})

    date = date + offset
