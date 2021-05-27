import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthorizeService } from "src/api-authorization/authorize.service";

@Component({
    selector: "app-nav-menu",
    templateUrl: "./nav-menu.component.html",
    styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent implements OnInit {
    public isAuthenticated: Observable<boolean>;
    isExpanded = false;
    isDropDownExpanded = false;

    constructor(private authorizeService: AuthorizeService) { }

    ngOnInit() {
        this.isAuthenticated = this.authorizeService.isAuthenticated();
    }

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    toggleDropDown() {
        this.isDropDownExpanded = !this.isDropDownExpanded;
    }
}
