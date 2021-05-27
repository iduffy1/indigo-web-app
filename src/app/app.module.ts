import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppComponent } from './app.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { EventFilterComponent } from './event-filter/event-filter.component';
import { EventsListComponent } from './events-list/events-list.component';
import { ErrorInterceptor } from './error.interceptor';
import { GroupedEventsListComponent } from './grouped-events-list/grouped-events-list.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { MapPageComponent } from './map-page/map-page.component';
import { OlMapComponent } from './ol-map/ol-map.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { GroupedEventFilterComponent } from './grouped-event-filter/grouped-event-filter.component';
import { GroupedEventPageComponent } from './grouped-event-page/grouped-event-page.component';
import { GroupedEventPoiListComponent } from './grouped-event-poi-list/grouped-event-poi-list.component';
import { GroupedEventChartComponent } from './grouped-event-chart/grouped-event-chart.component';
import { ChartsModule } from 'ng2-charts';
import { GroupedEventDetailsComponent } from './grouped-event-details/grouped-event-details.component';
import { SingleEventPageComponent } from './single-event-page/single-event-page.component';
import { SingleEventDetailsComponent } from './single-event-details/single-event-details.component';
import { SingleEventChartComponent } from './single-event-chart/single-event-chart.component';
import { SingleEventDialogComponent } from './single-event-dialog/single-event-dialog.component';
import { HomePageComponent } from './home-page/home-page.component';

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
        GroupedEventPoiListComponent,
        GroupedEventChartComponent,
        GroupedEventPageComponent,
        GroupedEventDetailsComponent,
        SingleEventPageComponent,
        SingleEventChartComponent,
        SingleEventDetailsComponent,
        SingleEventDialogComponent,
        HomePageComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        ApiAuthorizationModule,
        AngularMaterialModule,
        MatDialogModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ChartsModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
