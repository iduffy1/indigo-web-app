
export interface Poi {
  poiId : number;
  timestamp : Date;
  deviceName : string;
  location : string;
  speed : number;
  poiValue : number;
  poiCode : string;
  poiCodeDesc : string;
  trackLocation : string;
  mileageDir : string;
}

export interface TrendLine {
  dateRangeDays : number;
  targetDate : Date;
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
  mileageDir : string;
  numPois : number;
  latestPoiDate : string;
  trendLine : TrendLine;
}

export interface GroupedEventDetails extends GroupedEvent {
  pois : Poi[];
}
