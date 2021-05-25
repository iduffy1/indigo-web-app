import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { EventsListComponent } from './events-list/events-list.component';
import { GroupedEventPageComponent } from './grouped-event-page/grouped-event-page.component';
import { GroupedEventsListComponent } from './grouped-events-list/grouped-events-list.component';
import { MapPageComponent } from './map-page/map-page.component';
import { SingleEventPageComponent } from './single-event-page/single-event-page.component';

const routes: Routes = [
    { path: '', component: EventsListComponent, pathMatch: 'full' },
    { path: 'events', component: EventsListComponent },
    { path: 'groups', component: GroupedEventsListComponent },
    { path: 'map', component: MapPageComponent },
    { path: 'dash', component: DashBoardComponent },
    { path: 'group/:id', component: GroupedEventPageComponent },
    { path: 'event/:id', component: SingleEventPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
