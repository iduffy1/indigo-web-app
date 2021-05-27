import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthorizeService } from "src/api-authorization/authorize.service";

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {
    public isAuthenticated: Observable<boolean>;

    constructor(private authorizeService: AuthorizeService) { }

    ngOnInit() {
        this.isAuthenticated = this.authorizeService.isAuthenticated();
    }
}
