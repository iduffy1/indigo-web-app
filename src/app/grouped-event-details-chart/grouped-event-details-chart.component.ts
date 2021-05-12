import { Component, Input } from "@angular/core";
import { GroupedEventDetails } from "src/models/dto";

@Component({
    selector: "app-grouped-event-details-chart",
    templateUrl: "./grouped-event-details-chart.component.html",
})
export class GroupedEventDetailsChartComponent {
    @Input() groupedEventDetails: GroupedEventDetails;
}
