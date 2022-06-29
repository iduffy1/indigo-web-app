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
import { SingleEventPageComponent } from "../single-event-page/single-event-page.component";
import { SingleEventDialogComponent } from "../single-event-dialog/single-event-dialog.component";
import { delay } from "rxjs/operators";

@Component({
    selector: "raw-records-list",
    templateUrl: "./raw-records-list.component.html",
    styleUrls: ["./raw-records-list.component.css"],
})
export class RawRecordsListComponent implements OnInit, AfterViewInit, OnDestroy {
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
        console.log("afterViewInit called for event list component");

        this.subscription = this.indigoDataService.eventFilterResults$
            .pipe(
                delay(1000)    // Delay updating the sort until after this event is handled.
            ).subscribe(
            {
                next: (result) => {
                    if (result?.data) {
                        this.pois = result.data;
                        this.currentFilter = result.filter;
                        // For the first sort only, let matSort do the sorting so it knows the
                        // initial sort order and updates the arrows in the column headers correctly.
                        // Otherwise, apply the sort ourselves directly because matSort.sort() will
                        // toggle the sort direction. (Unknown reason)
                        if (!this.sortedPois) {
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

    openSearchFilter() {
        const dialogRef = this.dialog.open(EventFilterComponent, {
            width: "800px",
            data: this.currentFilter,
        });
    }

    getRowStyle(ge: Poi)  {
        return {};
    }

    onViewClicked(poiId) {
        const dialogRef = this.dialog.open(SingleEventDialogComponent, {
            width: "800px",
            data: poiId,
        });
    }
}
