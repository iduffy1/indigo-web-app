import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppComponent } from './app.component';
import { CounterComponent } from './counter/counter.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { EventFilterComponent } from './event-filter/event-filter.component';
import { EventsListComponent } from './events-list/events-list.component';
import { ErrorInterceptor } from './error.interceptor';
import { GroupedEventsComponent } from './grouped-events/grouped-events.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { MapPageComponent } from './ol-map/map-page/map-page.component';
import { OlMapComponent } from './ol-map/ol-map.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    EventsListComponent,
    GroupedEventsComponent,
    OlMapComponent,
    MapPageComponent,
    DashBoardComponent,
    EventFilterComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ApiAuthorizationModule,
    AngularMaterialModule,
    MatDialogModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'events', component: EventsListComponent },
      { path: 'groups', component: GroupedEventsComponent },
      { path: 'map', component: MapPageComponent },
      { path: 'dash', component: DashBoardComponent }
  //    { path: 'event-filter', component: EventFilterComponent }
    ]),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
