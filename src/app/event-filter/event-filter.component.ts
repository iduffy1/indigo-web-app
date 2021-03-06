import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { EventFilter } from "src/models/event-filter";
import { IndigoDataService } from "../indigo-data.service";

@Component({
    selector: "app-event-filter",
    templateUrl: "./event-filter.component.html",
    styleUrls: ["./event-filter.component.css"],
})
export class EventFilterComponent implements OnInit, OnDestroy {
    form: FormGroup;
    dateFrom: string;
    dateTo: string;
    track: string;
    distFrom: string;
    distTo: string;
    mileageDir: string;
    eventType: string;
    latMin: string;
    latMax: string;
    lonMin: string;
    lonMax: string;

    errorMessages: string[] = [];
    isLoading = false;

    subscription: Subscription;

    constructor(
        public dialogRef: MatDialogRef<EventFilterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EventFilter,
        private indigoDataService: IndigoDataService
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            dateFrom: new FormControl(this.data.dateFrom),
            dateTo: new FormControl(this.data.dateTo),
            route: new FormControl(this.data.route),
            track: new FormControl(this.data.track),
            distFrom: new FormControl(this.data.distFrom),
            distTo: new FormControl(this.data.distTo),
            mileageDir: new FormControl(this.data.mileageDir ?? ""),
            eventType: new FormControl(this.data.eventType ?? ""),
            latMin: new FormControl(this.data.latMin),
            latMax: new FormControl(this.data.latMax),
            lonMin: new FormControl(this.data.lonMin),
            lonMax: new FormControl(this.data.lonMax),

        });

        this.subscription = this.indigoDataService.eventFilterResults$.subscribe(
            {
                next: (results) => {
                    if (this.isLoading) {
                        if (results.errors) {
                            this.errorMessages = results.errors;
                            this.isLoading = false;
                        } else {
                            this.dialogRef.close();
                        }
                    }
                },
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSubmit() {
        const eventFilter: EventFilter = {
            dateFrom: this.form.get("dateFrom").value,
            dateTo: this.form.get("dateTo").value,
            route: this.form.get("route").value,
            track: this.form.get("track").value,
            distFrom: this.form.get("distFrom").value,
            distTo: this.form.get("distTo").value,
            mileageDir: this.form.get("mileageDir").value,
            eventType: this.form.get("eventType").value,
            latMin: this.form.get("latMin").value,
            latMax: this.form.get("latMax").value,
            lonMin: this.form.get("lonMin").value,
            lonMax: this.form.get("lonMax").value,
        };

        console.log(eventFilter);

        this.errorMessages = [];
        this.isLoading = true;
        this.indigoDataService.loadEvents(eventFilter);
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
