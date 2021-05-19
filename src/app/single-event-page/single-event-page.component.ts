import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { switchMap, take, tap } from "rxjs/operators";
import { Poi } from "src/models/dto";
import { PoiData } from "src/models/poiData";
import { IndigoDataService } from "../indigo-data.service";

@Component({
    selector: "app-single-event-page",
    templateUrl: "./single-event-page.component.html",
})
export class SingleEventPageComponent implements OnInit {
    private poiId: number;
    public poiData: PoiData;

    constructor(
        private route: ActivatedRoute,
        private indigoDataService: IndigoDataService
    ) {}

    ngOnInit() {
        this.poiId = this.route.snapshot.params.id;
        console.log("Poi details");
        console.log(this.route);

        // Get poi and poi traces
        this.indigoDataService.loadDataTraces(this.poiId)
            .subscribe({
                next: (result) => {
                    console.log(result);
                    this.poiData = result;
                }
            });

    }
}
