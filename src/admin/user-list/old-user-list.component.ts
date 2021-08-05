import { Component, OnInit } from "@angular/core";
import { IndigoDataService } from "src/app/indigo-data.service";
import { DtoUser } from "../models";

@Component({
    selector: 'old-user-list',
    templateUrl: './user-list.component.html'
})
export class OldUserListComponent implements OnInit {

    public users : DtoUser[];
    displayedColumns : string[] = ['id', 'name', 'email', 'roles', 'claims'];

    constructor(
        private indigoDataService : IndigoDataService
    ) {}

    ngOnInit() {
        this.indigoDataService.loadOldUsers().subscribe({
            next : (result) => this.users = result
        })
    }

}
