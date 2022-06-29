import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from 'src/admin/user-list/user-list.component';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { EventsListComponent } from './events-list/events-list.component';
import { RawRecordsListComponent } from './raw-records-list/raw-records-list.component';
import { GroupedEventPageComponent } from './grouped-event-page/grouped-event-page.component';
import { GroupedEventsListComponent } from './grouped-events-list/grouped-events-list.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MapPageComponent } from './map-page/map-page.component';
import { SingleEventPageComponent } from './single-event-page/single-event-page.component';
import { OldUserListComponent } from '../admin/user-list/old-user-list.component';
import { ToolsComponent } from './tools/tools.component';

const routes: Routes = [
    { path: '', redirectTo: '/groups', pathMatch: 'full' },
    { path: 'home', component: HomePageComponent, pathMatch: 'full' },
    { path: 'events', component: EventsListComponent, canActivate: [AuthorizeGuard] },
    { path: 'groups', component: GroupedEventsListComponent, canActivate: [AuthorizeGuard] },
    { path: 'rawrecords', component: RawRecordsListComponent, canActivate: [AuthorizeGuard] },
    { path: 'map', redirectTo: 'map/', pathMatch: 'full' },
    { path: 'map/:id', component: MapPageComponent, canActivate: [AuthorizeGuard] },
    { path: 'dash', component: DashBoardComponent, canActivate: [AuthorizeGuard] },
    { path: 'group/:id', component: GroupedEventPageComponent, canActivate: [AuthorizeGuard] },
    { path: 'event/:id', component: SingleEventPageComponent, canActivate: [AuthorizeGuard] },
    { path: 'users', component: UserListComponent, canActivate: [AuthorizeGuard] },
    { path: 'oldusers', component: OldUserListComponent, canActivate: [AuthorizeGuard] },
    { path: 'tools', component: ToolsComponent, canActivate: [AuthorizeGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
