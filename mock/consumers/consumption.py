from numpy import array
from enum import Enum

class OutltetConsumptionType(Enum):
    ESSENTIAL="ESSENTIAL"
    NONESSENTIAL="NONESSENTIAL"
    CLOSED="CLOSED"

class Source(Enum):
    BATTERY="BATTERY"
    GRID="GRID"
    SOLAR="SOLAR"