import { Component, Inject, OnInit } from "@angular/core";
import { IndigoDataService } from "../indigo-data.service";

@Component({
    selector: "app-tools",
    templateUrl: "./tools.component.html",
})
export class ToolsComponent  {
    recordId : string;
    poiId : string;
    public fileContents : string;

    constructor(
        @Inject("BASE_URL") private baseUrl: string,
        private indigoDataService : IndigoDataService
    ) {}

    onClickSubmit(data) {
        this.indigoDataService.loadRecordRaw(data.recordId)
            .subscribe((s) => {
                this.fileContents = s;
            })
    }

}
