import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poi } from 'src/models/dto';
import { IndigoDataService } from '../indigo-data.service';
import { MatDialog } from '@angular/material/dialog';
import { EventFilterComponent } from '../event-filter/event-filter.component';
import { MatSort, Sort } from '@angular/material/sort';
import { EventFilter, EventFilter_ForRecentDays } from 'src/models/event-filter';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit, AfterViewInit {
  public pois: Poi[];
  public sortedPois : Poi[];
  @ViewChild(MatSort, { static: false }) matSort: MatSort;
  private currentSort: Sort = { active: 'timestamp', direction: 'desc'};

  private defaultInitialFilter : EventFilter = EventFilter_ForRecentDays(90);
  private currentFilter : EventFilter = this.defaultInitialFilter;

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private indigoDataService : IndigoDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log('oninit called for event list component');
  }

  ngAfterViewInit() {
   // this.matSort.sort({ id: this.currentSort.active, start: 'desc', disableClear: true});
   this.indigoDataService.eventFilterResults.subscribe({
    next : result => {
      if (!result) {
        console.log("About to fetch default event data");
        this.indigoDataService.loadEvents(this.defaultInitialFilter);
      }
      else if (result.data) {
        this.pois = result.data;
        this.currentFilter = result.filter;
        this.sortData(this.currentSort);
      }
    }
  });
}

  openSearchFilter() {
    const dialogRef = this.dialog.open(EventFilterComponent, {
      width: '800px',
      data: this.currentFilter
    });
  }

  // Called by MatSort to apply a sort to the data
  sortData(sort: Sort) {
    console.log("sort called");
    console.log(sort);
    if (!this.pois)
    {
      console.log("no data yet");
      return;
    }
    this.currentSort = sort;
    const data = this.pois.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedPois = data;
      return;
    }
    this.sortedPois = data.sort((a,b) => this.compareByColumn(a, b, sort));
    console.log("sort finished");
    console.log(this.sortedPois);
  }

  compareByColumn(a : Poi, b : Poi, sort : Sort) {
    const isAsc =  sort.direction === 'asc';
    switch (sort.active) {
      case 'poiId': return this.compare(a.poiId, b.poiId, isAsc);
      case 'timestamp': return this.compare(a.timestamp, b.timestamp, isAsc);
      case 'trackLocation': return this.compare(a.trackLocation, b.trackLocation, isAsc);
      case 'mileageDir': return this.compare(a.mileageDir, b.mileageDir, isAsc);
      case 'speed': return this.compare(a.speed, b.speed, isAsc);
      case 'poiCode': return this.compare(a.poiCode, b.poiCode, isAsc);
      case 'poiValue': return this.compare(a.poiValue, b.poiValue, isAsc);
      default: return 0;
    }
  }

  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getRowStyle(ge : Poi) {
  }

}

