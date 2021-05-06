import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { GroupedEvent, Poi } from "src/models/dto";
import { EventFilter, EventFilterResults, EventFilter_ForRecentDays } from "src/models/event-filter";
import { GroupedEventFilter, GroupedEventFilterResults } from "src/models/grouped-event-filter";
import { EventFilterComponent } from "./event-filter/event-filter.component";

@Injectable({providedIn: 'root'})
export class IndigoDataService {
  constructor (
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {

    }

  eventFilterResults = new BehaviorSubject<EventFilterResults>(null);


  loadEvents(filter : EventFilter) {
    this.http.post<Poi[]>(
      this.baseUrl + 'api/events/query', { filter: filter, page: {skip:0, take:200} })
      .subscribe({
        next: result => {
          this.eventFilterResults.next({ filter: filter, data : result });
        },
        error: error => {
          this.eventFilterResults.next({ filter: filter, errors : error.split('\r\n')});
        }
      });
  }

  groupedEventFilterResults = new BehaviorSubject<GroupedEventFilterResults>(null);


  loadGroupedEvents(filter : GroupedEventFilter) {
    this.http.post<GroupedEvent[]>(
      this.baseUrl + 'api/groups/query', { filter: filter, page: {skip:0, take:200} })
      .subscribe({
        next: result => {
          this.groupedEventFilterResults.next({ filter: filter, data : result });
        },
        error: error => {
          this.groupedEventFilterResults.next({ filter: filter, errors : error.split('\r\n')});
        }
      });
  }

}
