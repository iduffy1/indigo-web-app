import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IndigoDataService } from "../indigo-data.service";

@Component({
    selector: "app-map-page",
    templateUrl: "./map-page.component.html",
    styleUrls: ["./map-page.component.css"],
})
export class MapPageComponent implements OnInit {

    poiId : number;

    constructor(
        private route: ActivatedRoute,
        private indigoDataService: IndigoDataService
    ) { }

    ngOnInit() {
        this.poiId = this.route.snapshot.params.id;
        console.log("PoiId = " + this.poiId);
    }
}
