
export interface Poi {
  poiId : number;
  timestamp : string;
  deviceName : string;
  location : string;
  speed : number;
  poiValue : number;
  poiCode : string;
  poiCodeDesc : string;
  trackLocation : string;
  direction : string;
}

export interface TrendLine {
  dateRangeDays : number;
  targetDate : string;
  gradient : number;
  offset : number;
  actualDateRange : object;
  daysSinceLastDate : number;
  valueAtLastDate : number;
  units : string;
  description : string;
}

export interface GroupedEvent {
  poiId : number;
  poiCode : string;
  poiCodeDesc : string;
  trackLocation : string;
  location: number[];
  milesDir : string;
  numPois : number;
  latestPoiDate : string;
  trendLine : TrendLine;
}
