import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { GroupedEventDetails, Poi } from "src/models/dto";
import { PoiSorting } from "../utils/poi-sorting";

@Component({
    selector: "app-grouped-event-details-list",
    templateUrl: "./grouped-event-details-list.component.html",
})
export class GroupedEventDetailsListComponent implements OnChanges {
    @Input() groupedEventDetails: GroupedEventDetails;

    sortedPois: Poi[];
    currentSort: Sort;
    sortData: ((sort: Sort) => void);

    constructor() {
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





}
