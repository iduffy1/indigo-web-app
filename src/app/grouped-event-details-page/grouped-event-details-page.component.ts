import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { switchMap, take } from "rxjs/operators";
import { GroupedEventDetails } from "src/models/dto";
import { IndigoDataService } from "../indigo-data.service";

@Component({
    selector: "app-grouped-event-details-page",
    templateUrl: "./grouped-event-details-page.component.html",
})
export class GroupedEventDetailsPageComponent implements OnInit {
    private poiId: number;
    public groupedEventDetails: GroupedEventDetails;

    constructor(
        private route: ActivatedRoute,
        private indigoDataService: IndigoDataService
    ) {}

    ngOnInit() {
        this.poiId = this.route.snapshot.params.id;
        console.log("Event group details");
        console.log(this.route);

        // Get current filter on group page
        // Ugly hack - whole concept of groups to be redesigned.
        this.indigoDataService.groupedEventFilterResults$
            .pipe(
                take(1),
                switchMap((filterResults) => {
                    return this.indigoDataService.loadGroupDetails(
                        this.poiId,
                        filterResults.filter.event
                    );
                })
            )
            .subscribe({
                next: (result) => { (this.groupedEventDetails = result); console.log(result);}
            });
    }
}
