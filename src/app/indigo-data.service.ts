import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { GroupedEvent, Poi } from "src/models/dto";
import { EventFilter } from "src/models/event-filter";

@Injectable({providedIn: 'root'})
export class IndigoDataService {
  constructor (
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {}

  private pois : Poi[] = [];
  poisChanged = new BehaviorSubject<Poi[]>([]);

  private groupedEvents : GroupedEvent[] = [];
  groupedEventsChanged = new BehaviorSubject<GroupedEvent[]>([]);



  loadEvents() {
    this.http.get<Poi[]>(this.baseUrl + 'api/events/90').subscribe(result => {
      this.pois = result;
      this.poisChanged.next(this.pois);
    }, error => console.error(error));
  }

  loadEventsFiltered(eventFilter : EventFilter) : Observable<Poi[]> {
    return this.http.post<Poi[]>(
      this.baseUrl + 'api/events/query', { query: eventFilter, page: {skip:0, take:100000} })
      .pipe(
        tap({
          next: result => {
            this.pois = result;
            this.poisChanged.next(this.pois);
          },
          error: error => console.error(error)
        })
      );
  }

  loadEventGroups() : Observable<GroupedEvent[]> {
    return this.http.get<GroupedEvent[]>(this.baseUrl + 'api/groups/90')
      .pipe(
        tap({
          next: result => {
            this.groupedEvents = result;
            this.groupedEventsChanged.next(this.groupedEvents);
          },
          error: error => {
            console.log("Error getting results of http");
            console.error(error);
          }
        })
      );
  }



}
