import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { MAT_DATE_LOCALE } from "@angular/material/core";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from "./app.component";
import { DashBoardComponent } from "./dashboard/dashboard.component";
import { EventFilterComponent } from "./event-filter/event-filter.component";
import { EventsListComponent } from "./events-list/events-list.component";
import { ErrorInterceptor } from "./error.interceptor";
import { GroupedEventsListComponent } from "./grouped-events-list/grouped-events-list.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { MapPageComponent } from "./ol-map/map-page/map-page.component";
import { OlMapComponent } from "./ol-map/ol-map.component";
import { ApiAuthorizationModule } from "src/api-authorization/api-authorization.module";
import { AuthorizeGuard } from "src/api-authorization/authorize.guard";
import { AuthorizeInterceptor } from "src/api-authorization/authorize.interceptor";
import { AngularMaterialModule } from "./angular-material.module";
import { MatDialogModule } from "@angular/material/dialog";
import { GroupedEventFilterComponent } from "./grouped-event-filter/grouped-event-filter.component";
import { GroupedEventDetailsPageComponent } from "./grouped-event-details-page/grouped-event-details-page.component";
import { GroupedEventDetailsListComponent } from "./grouped-event-details-list/grouped-event-details-list.component";
import { GroupedEventDetailsChartComponent } from "./grouped-event-details-chart/grouped-event-details-chart.component";

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        EventsListComponent,
        GroupedEventsListComponent,
        OlMapComponent,
        MapPageComponent,
        DashBoardComponent,
        EventFilterComponent,
        GroupedEventFilterComponent,
        GroupedEventDetailsListComponent,
        GroupedEventDetailsChartComponent,
        GroupedEventDetailsPageComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        ApiAuthorizationModule,
        AngularMaterialModule,
        MatDialogModule,
        RouterModule.forRoot([
            { path: "", component: HomeComponent, pathMatch: "full" },
            { path: "events", component: EventsListComponent },
            { path: "groups", component: GroupedEventsListComponent },
            { path: "map", component: MapPageComponent },
            { path: "dash", component: DashBoardComponent },
            { path: "group/:id", component: GroupedEventDetailsPageComponent },
        ]),
        BrowserAnimationsModule,
        FontAwesomeModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthorizeInterceptor,
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
