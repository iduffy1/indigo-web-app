import { Poi } from "./dto";

export interface EventFilter {
  dateFrom : Date;
  dateTo : Date;
  track? : string;
  distFrom? : string;
  distTo? : string;
  mileageDir? : string;
  eventType? : string;
}


export interface EventFilterResults {
  filter : EventFilter;
  data? : Poi[];
  errors? : string[];
}

export function EventFilter_ForRecentDays(numDays : number) : EventFilter {
  const dateTo = new Date();
  const dateFrom = new Date(dateTo.getTime() - numDays * 86400 * 1000);
  return {
    dateFrom: dateFrom,
    dateTo : dateTo
  }
}
