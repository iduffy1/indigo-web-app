import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, shareReplay, switchMap } from "rxjs/operators";
import { GroupedEvent, GroupedEventDetails, Poi } from "src/models/dto";
import {
    EventFilter,
    EventFilterResults,
    EventFilter_ForRecentDays,
} from "src/models/event-filter";
import {
    GroupedEventDetailsFilter,
    GroupedEventFilter,
    GroupedEventFilterResults,
    GroupedEventFilter_ForRecentDays,
} from "src/models/grouped-event-filter";
import { PoiData } from "src/models/poiData";

@Injectable({ providedIn: "root" })
export class IndigoDataService {
    constructor(
        private http: HttpClient,
        @Inject("BASE_URL") private baseUrl: string
    ) {}

    private eventFilter$ = new BehaviorSubject<EventFilter>(
        EventFilter_ForRecentDays(90)
    );

    loadEvents(filter: EventFilter) {
        this.eventFilter$.next(filter);
    }

    eventFilterResults$ = this.eventFilter$.pipe(
        switchMap((filter) => {
            console.log("New event filter:");
            console.log(filter);
            return this.http
                .post<Poi[]>(this.baseUrl + "api/events/query", {
                    filter: filter,
                    page: { skip: 0, take: 200 },
                })
                .pipe(
                    map(
                        (result): EventFilterResults => {
                            return { filter: filter, data: result };
                        }
                    ),
                    catchError(
                        (error): Observable<EventFilterResults> => {
                            return of({
                                filter: filter,
                                errors: error.split("\r\n"),
                            });
                        }
                    )
                );
        }),
        shareReplay(1)
    );

    // Load a single event.
    loadEvent(poiId) {
        // Use the generic event query filter.
        // Date range isn't optional so specify any time in the past
        const poiFilter : EventFilter = {
            dateFrom : new Date(0),
            dateTo : new Date(),
            poiIds : [poiId]
        };

        // We expect an array in response with one element.
        // Return just the first element (if there is one).
        return this.http
            .post<Poi[]>(this.baseUrl + "api/events/query", {
                filter: poiFilter,
                page: { skip: 0, take: 1 }
            })
            .pipe(
                map(pois => pois.length > 0 ? pois[0] : null)
            );
    }

    loadDataTraces(poiId) {
        return this.http
            .post<PoiData>(this.baseUrl + "api/events/traces", {
                poiId : poiId,
                channels : []
            });
    }

    private groupedEventFilter$ = new BehaviorSubject<GroupedEventFilter>(
        GroupedEventFilter_ForRecentDays(90)
    );

    loadGroupedEvents(filter: GroupedEventFilter) {
        this.groupedEventFilter$.next(filter);
    }

    groupedEventFilterResults$ = this.groupedEventFilter$.pipe(
        switchMap((filter) => {
            console.log("New grouped event filter:");
            console.log(filter);
            return this.http
                .post<GroupedEvent[]>(this.baseUrl + "api/groups/query", {
                    filter: filter,
                    page: { skip: 0, take: 200 },
                })
                .pipe(
                    map(
                        (result): GroupedEventFilterResults => {
                            return { filter: filter, data: result };
                        }
                    ),
                    catchError(
                        (error): Observable<GroupedEventFilterResults> => {
                            return of({
                                filter: filter,
                                errors: error.split("\r\n"),
                            });
                        }
                    )
                );
        }),
        shareReplay(1)
    );

    loadGroupDetails(poiId: number, eventFilter: EventFilter) {
        const filter: GroupedEventDetailsFilter = {
            event: eventFilter,
            poiId: poiId,
        };
        return this.http.post<GroupedEventDetails>(
            this.baseUrl + "api/groups/get",
            { filter: filter }
        );
    }
}
