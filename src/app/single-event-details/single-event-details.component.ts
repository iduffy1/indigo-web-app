import { Component, Input } from "@angular/core";
import { Poi } from "src/models/dto";
import { PoiData } from "src/models/poiData";

@Component({
    selector : 'app-single-event-details',
    templateUrl : './single-event-details.component.html',
    styleUrls : [ './single-event-details.component.css']
})
export class SingleEventDetailsComponent {
    @Input() poiData : PoiData;
}
