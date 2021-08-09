import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Sort } from "@angular/material/sort";
import { GroupedEventDetails, Poi } from "src/models/dto";
import { SingleEventDialogComponent } from "../single-event-dialog/single-event-dialog.component";
import { PoiSorting } from "../utils/poi-sorting";

@Component({
    selector: "app-grouped-event-poi-list",
    templateUrl: "./grouped-event-poi-list.component.html",
})
export class GroupedEventPoiListComponent implements OnChanges {
    @Input() groupedEventDetails: GroupedEventDetails;

    sortedPois: Poi[];
    currentSort: Sort;
    sortData: ((sort: Sort) => void);

    constructor(
        public dialog: MatDialog
    ) {
        this.sortData = PoiSorting.createSortDataFunc(
            () => this.groupedEventDetails.pois,
            (sortedPois, sort) => {
                this.sortedPois = sortedPois;
                this.currentSort = sort;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Changes');
        console.log(changes);
        if (changes.groupedEventDetails?.currentValue) {
            this.sortData({
                active: "timestamp",
                direction: "desc",
            });
        }
    }

    onViewClicked(poiId) {
        const dialogRef = this.dialog.open(SingleEventDialogComponent, {
            width: "800px",
            data: poiId,
        });
    }




}
