import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { switchMap, take, tap } from "rxjs/operators";
import { Poi } from "src/models/dto";
import { PoiData } from "src/models/poiData";
import { IndigoDataService } from "../indigo-data.service";

@Component({
    selector: "app-single-dialog-page",
    templateUrl: "./single-event-dialog.component.html",
})
export class SingleEventDialogComponent implements OnInit {
    private poiId: number;
    public poiData: PoiData;

    constructor(
        public dialogRef: MatDialogRef<SingleEventDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number,
        private indigoDataService: IndigoDataService
    ) {}

    ngOnInit() {
        this.poiId = this.data;

        // Get poi and poi traces
        this.indigoDataService.loadDataTraces(this.poiId)
            .subscribe({
                next: (result) => {
                    console.log(result);
                    this.poiData = result;
                }
            });
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
