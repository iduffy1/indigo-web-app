import { Component, Input, OnInit } from "@angular/core";
import { GroupedEventDetails } from "src/models/dto";

@Component({
    selector: "app-grouped-event-details",
    templateUrl: "./grouped-event-details.component.html",
    styleUrls: ["./grouped-event-details.component.css"],
})
export class GroupedEventDetailsComponent implements OnInit {
    @Input() groupedEventDetails: GroupedEventDetails;

    constructor() {}

    ngOnInit(): void {}
}
