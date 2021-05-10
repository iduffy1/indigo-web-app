import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort, Sort } from '@angular/material/sort';
import { GroupedEvent } from 'src/models/dto';
import { IndigoDataService } from '../indigo-data.service';
import { GroupedEventFilter, GroupedEventFilter_ForRecentDays } from 'src/models/grouped-event-filter';
import { MatDialog } from '@angular/material/dialog';
import { GroupedEventFilterComponent } from '../grouped-event-filter/grouped-event-filter.component';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-grouped-events',
  templateUrl: './grouped-events.component.html',
  styleUrls: ['./grouped-events.component.css']
})

export class GroupedEventsComponent implements OnInit, AfterViewInit, OnDestroy {
  public groupedEvents: GroupedEvent[];
  public sortedGroupedEvents : GroupedEvent[];
  @ViewChild(MatSort, { static: false }) matSort: MatSort;
  private currentSort: Sort = { active: 'valueAtLastDate', direction: 'desc'};

  private defaultInitialFilter : GroupedEventFilter = GroupedEventFilter_ForRecentDays(90);
  private currentFilter : GroupedEventFilter = this.defaultInitialFilter;

  private subscription : Subscription;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private indigoDataService : IndigoDataService,
    public dialog: MatDialog
   ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Load the data and apply initial sort.
    // Can only access MatSort after ViewInit so fetch the data here to guarantee matSort is available when data returns

    this.subscription = this.indigoDataService.groupedEventFilterResults$.subscribe({
      next : result => {
        if (result?.data) {
          this.groupedEvents = result.data
          this.currentFilter = result.filter;
          this.sortData(this.currentSort);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  // Called by MatSort to apply a sort to the data
  sortData(sort: Sort) {
    if (!this.groupedEvents) {
      console.log("no grouped event data yet");
      this.sortedGroupedEvents = [];
      return;
    }

    this.currentSort = sort;
    const data = this.groupedEvents.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedGroupedEvents = data;
      return;
    }
    this.sortedGroupedEvents = data.sort((a,b) => this.compareByColumn(a, b, sort));
  }

  compareByColumn(a : GroupedEvent, b : GroupedEvent, sort : Sort) {
    const isAsc =  sort.direction === 'asc';
    switch (sort.active) {
      case 'latestPoiDate': return compare(a.latestPoiDate, b.latestPoiDate, isAsc);
      case 'trackLocation': return compare(a.trackLocation, b.trackLocation, isAsc);
      case 'mileageDir': return compare(a.mileageDir, b.mileageDir, isAsc);
      case 'numPois': return compare(a.numPois, b.numPois, isAsc);
      case 'poiCode': return compare(a.poiCode, b.poiCode, isAsc);
      case 'gradient': return compare(a.trendLine.gradient, b.trendLine.gradient, isAsc);
      case 'valueAtLastDate': return compare(a.trendLine.valueAtLastDate, b.trendLine.valueAtLastDate, isAsc);
      case 'daysSinceLastDate': return compare(a.trendLine.daysSinceLastDate, b.trendLine.daysSinceLastDate, isAsc);
      default: return 0;
    }
  }

  getRowStyle(ge : GroupedEvent) {
    if (ge.trendLine.gradient > 1.5)
        return {"background-color":"#ea1538", "color":"#ffffff"};  // Dark red
    else if (ge.trendLine.gradient > 1)
        return { "background-color": "#e5451a", "color": "#eeeeee" };   // Red - orange
    else if (ge.trendLine.gradient > 0.5)
        return { "background-color": "#e3a01c" };   // Orange
    else if (ge.trendLine.gradient > 0.25)
        return { "background-color": "#edda12" };   // Orange - yellow
    return {};
  }

  openSearchFilter() {
    const dialogRef = this.dialog.open(GroupedEventFilterComponent, {
      width: '800px',
      data: this.currentFilter
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

