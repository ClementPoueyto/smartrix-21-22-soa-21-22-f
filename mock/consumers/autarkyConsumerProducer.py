from numpy import array
from consumers.consumption import Source
class ConsumerProducer:
    def __init__(self, dayOfWeek, saturday, sunday, sourceCons,dayOfWeekProd, saturdayProd, sundayProd, destinationProd):
        self.dayOfWeek = dayOfWeek
        self.saturday = saturday
        self.sunday = sunday
        self.dayOfWeekProd = dayOfWeekProd
        self.saturdayProd = saturdayProd
        self.sundayProd = sundayProd
        self.sourceCons = sourceCons
        self.destinationProd = destinationProd

    def getDayOfWeek(self):
        return self.dayOfWeek

    def getSaturday(self):
        return self.saturday

    def getSunday(self):
        return self.sunday

    def getDayOfWeekProd(self):
        return self.dayOfWeekProd

    def getSaturdayProd(self):
        return self.saturdayProd

    def getSundayProd(self):
        return self.sundayProd

    def getSourceCons(self):
        return self.sourceCons

    def getDestinationProd(self):
        return self.destinationProd

class DayConsumption:

    def __init__(self, consumptions: array,):
        self.consumptions = consumptions
        self.totalEssential = 0
        self.totalNonEssential = 0
        for i in range(0, len(consumptions)):
            self.totalEssential += consumptions[i]*0.75
            self.totalNonEssential += consumptions[i]*0.25

    def getNonEssentialConsumption(self, hour):
        return self.consumptions[hour]*0.75
    def getEssentialConsumption(self, hour):
        return self.consumptions[hour]*0.25
    def getTotalEssential(self):
        return self.totalEssential
    def getTotalNonEssential(self):
        return self.totalNonEssential

class DayProduction:
    def __init__(self, productions: array):
        self.productions = productions
        self.total=0
        for i in range(0, len(productions)):
            self.total += productions[i]
    def getProduction(self, hour):
        return self.productions[hour]
    def getTotal(self):
        return self.total

class DaySource:
    def __init__(self, source: array):
        self.source = source
        self.total=0
    def getSource(self, hour):
        return self.source[hour]


# solar to battery
AUTARKY = ConsumerProducer(
    DayConsumption(
        [0, 0, 0, 0, 0, 0, 0, 0, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06,
            1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 0, 0]
    ),
    DayConsumption(
        [0, 0, 0, 0, 0, 0, 0, 0, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06,
            1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 0, 0]
    ),
    DayConsumption(
        [0, 0, 0, 0, 0, 0, 0, 0, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06,
            1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 0, 0]
    ),
    DaySource(
        [Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR,
            Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY]
    ),
    DayProduction(
        [0, 0, 0, 0, 0, 0, 0, 0, 1.06, 1.06, 2.12, 2.12, 2.12, 2.12,
            1.06, 1.06, 1.06, 1.06, 1.06, 0, 0, 0, 0, 0]
    ),
   DayProduction(
        [0, 0, 0, 0, 0, 0, 0, 0, 1.06, 1.06, 2.12, 2.12, 2.12, 2.12,
            1.06, 1.06, 1.06, 1.06, 1.06, 0, 0, 0, 0, 0]
    ),
   DayProduction(
        [0, 0, 0, 0, 0, 0, 0, 0, 1.06, 1.06, 2.12, 2.12, 2.12, 2.12,
            1.06, 1.06, 1.06, 1.06, 1.06, 0, 0, 0, 0, 0]
    ),
    DaySource(
        [Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY,
            Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY, Source.BATTERY]
    ),
)

# solar
SEMI_AUTARKY = ConsumerProducer(
    DayConsumption(
        [0, 0, 0, 0, 0, 0, 1.53, 1.53, 1.53, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 1.53, 1.53, 1.53, 1.53, 1.53, 1.53]
    ),
    DayConsumption(
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.53, 1.53, 1.53,
            1.53, 1.53, 1.53, 1.53, 1.53, 1.53, 0, 0, 0, 0, 0]
    ),
    DayConsumption(
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.06, 1.06, 1.06, 1.06,
            1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06, 1.06]
    ),
    DaySource(
        [Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR,
            Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.SOLAR, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID]
    ),
    DayProduction(
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.53, 1.53, 1.53,
            1.53, 1.53, 1.53, 1.53, 1.53, 0, 0, 0, 0, 0, 0]
    ),
    DayProduction(
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.53, 1.53, 1.53,
            1.53, 1.53, 1.53, 1.53, 1.53, 0, 0, 0, 0, 0, 0]
    ),
    DayProduction(
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.53, 1.53, 1.53,
            1.53, 1.53, 1.53, 1.53, 1.53, 0, 0, 0, 0, 0, 0]
    ),
    DaySource(
        [Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID,
            Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID, Source.GRID]
    ),
)