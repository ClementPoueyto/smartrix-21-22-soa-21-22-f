from numpy import array

class DayConsumption:

    def __init__(self, consumptions: array):
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





class Consumer:

    def __init__(self, dayOfWeek, saturday, sunday):
        self.dayOfWeek = dayOfWeek
        self.saturday = saturday
        self.sunday = sunday

    def getDayOfWeek(self):
        return self.dayOfWeek

    def getSaturday(self):
        return self.saturday

    def getSunday(self):
        return self.sunday



OLD_PERSON = Consumer(
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
    )
)

WORKER = Consumer(
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
    )
)

PIERREETMARIE = Consumer(
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
    )
)
