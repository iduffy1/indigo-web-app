import { GroupedEvent } from "./dto";
import { EventFilter } from "./event-filter";

export interface GroupedEventFilter {
  event : EventFilter;

  tlGradientMin? : string;
  tlValueMin? : string;
  tlMinEventCount? : string;
}


export interface GroupedEventFilterResults {
  filter : GroupedEventFilter;
  data? : GroupedEvent[];
  errors? : string[];
}


export interface GroupedEventDetailsFilter {
   event : EventFilter;

   poiId : number;
}

export function GroupedEventFilter_ForRecentDays(numDays : number) : GroupedEventFilter {
  const dateTo = new Date();
  const dateFrom = new Date(dateTo.getTime() - numDays * 86400 * 1000);
  return {
    event: {
      dateFrom: dateFrom,
      dateTo : dateTo
    }
  }
}
