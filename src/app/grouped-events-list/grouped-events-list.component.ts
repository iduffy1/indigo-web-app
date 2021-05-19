import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatSort, Sort } from "@angular/material/sort";
import { GroupedEvent } from "src/models/dto";
import { IndigoDataService } from "../indigo-data.service";
import {
    GroupedEventFilter,
    GroupedEventFilter_ForRecentDays,
} from "src/models/grouped-event-filter";
import { MatDialog } from "@angular/material/dialog";
import { GroupedEventFilterComponent } from "../grouped-event-filter/grouped-event-filter.component";
import { Subscription } from "rxjs";
import { GroupedEventsSorting } from "../utils/grouped-events-sorting";
import { delay } from "rxjs/operators";

@Component({
    selector: "app-grouped-events",
    templateUrl: "./grouped-events-list.component.html",
    styleUrls: ["./grouped-events-list.component.css"],
})
export class GroupedEventsListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort, { static: false }) matSort: MatSort;

    public groupedEvents: GroupedEvent[];
    public sortedGroupedEvents: GroupedEvent[];
    private currentSort: Sort = {
        active: "valueAtLastDate",
        direction: "desc",
    };
    sortData: (sort: Sort) => void;


    private defaultInitialFilter: GroupedEventFilter = GroupedEventFilter_ForRecentDays(90);
    private currentFilter: GroupedEventFilter = this.defaultInitialFilter;

    private subscription: Subscription;

    constructor(
        private http: HttpClient,
        @Inject("BASE_URL") private baseUrl: string,
        private indigoDataService: IndigoDataService,
        public dialog: MatDialog
    ) {
        this.sortData = GroupedEventsSorting.createSortDataFunc(
            () => this.groupedEvents,
            (sortedGroupedEvents, sort) => {
                this.sortedGroupedEvents = sortedGroupedEvents;
                this.currentSort = sort;
            }
        )
    }

    ngOnInit() {}

    ngAfterViewInit() {
        // Load the data and apply initial sort.
        // Can only access MatSort after ViewInit so fetch the data here to guarantee matSort is available when data returns

        this.subscription = this.indigoDataService.groupedEventFilterResults$
            .pipe(
                delay(0)
            ).subscribe(
            {
                next: (result) => {
                    if (result?.data) {
                        this.groupedEvents = result.data;
                        this.currentFilter = result.filter;
                        if (!this.sortedGroupedEvents) {
                            this.matSort.sort({ id: this.currentSort.active, start: 'desc', disableClear: true});
                        }
                        else {
                            this.sortData(this.currentSort);
                        }
                    }
                },
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getRowStyle(ge: GroupedEvent) {
        if (ge.trendLine.gradient > 1.5)
            return { "background-color": "#ea1538", color: "#ffffff" };  // Dark red
        else if (ge.trendLine.gradient > 1)
            return { "background-color": "#e5451a", color: "#eeeeee" };  // Red - orange
        else if (ge.trendLine.gradient > 0.5)
            return { "background-color": "#e3a01c" }; // Orange
        else if (ge.trendLine.gradient > 0.25)
            return { "background-color": "#edda12" }; // Orange - yellow
        return {};
    }

    openSearchFilter() {
        const dialogRef = this.dialog.open(GroupedEventFilterComponent, {
            width: "800px",
            data: this.currentFilter,
        });
    }
}

