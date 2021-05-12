import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Poi } from "src/models/dto";
import { IndigoDataService } from "../indigo-data.service";
import { MatDialog } from "@angular/material/dialog";
import { EventFilterComponent } from "../event-filter/event-filter.component";
import { MatSort, Sort } from "@angular/material/sort";
import {
    EventFilter,
    EventFilter_ForRecentDays,
} from "src/models/event-filter";
import { Subscription } from "rxjs";
import { PoiSorting } from "../utils/poi-sorting";

@Component({
    selector: "app-events-list",
    templateUrl: "./events-list.component.html",
    styleUrls: ["./events-list.component.css"],
})
export class EventsListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort, { static: false }) matSort: MatSort;

    private defaultInitialFilter: EventFilter = EventFilter_ForRecentDays(90);
    private currentFilter: EventFilter = this.defaultInitialFilter;

    private subscription: Subscription;

    public pois: Poi[];
    sortedPois: Poi[];
    currentSort: Sort = { active: "timestamp", direction: "desc" };
    sortData: (sort: Sort) => void;

    constructor(
        http: HttpClient,
        @Inject("BASE_URL") baseUrl: string,
        private indigoDataService: IndigoDataService,
        public dialog: MatDialog
    ) {
        this.sortData = PoiSorting.createSortDataFunc(
            () => this.pois,
            (sortedPois, sort) => {
                this.sortedPois = sortedPois;
                this.currentSort = sort;
            }
        );
    }

    ngOnInit() {
        console.log("oninit called for event list component");
    }

    ngAfterViewInit() {
        // this.matSort.sort({ id: this.currentSort.active, start: 'desc', disableClear: true});
        this.subscription = this.indigoDataService.eventFilterResults$.subscribe(
            {
                next: (result) => {
                    if (result?.data) {
                        this.pois = result.data;
                        this.currentFilter = result.filter;
                        this.sortData(this.currentSort);
                    }
                },
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    openSearchFilter() {
        const dialogRef = this.dialog.open(EventFilterComponent, {
            width: "800px",
            data: this.currentFilter,
        });
    }

    getRowStyle(ge: Poi) {}
}
