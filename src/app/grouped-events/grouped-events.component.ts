import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort, Sort } from '@angular/material/sort';
import { GroupedEvent } from 'src/models/dto';



@Component({
  selector: 'app-grouped-events',
  templateUrl: './grouped-events.component.html',
  styleUrls: ['./grouped-events.component.css']
})

export class GroupedEventsComponent implements OnInit, AfterViewInit {
  public groupedEvents: GroupedEvent[];
  public sortedGroupedEvents : GroupedEvent[];
  @ViewChild(MatSort, { static: false }) matSort: MatSort;
  private initialSort: Sort = { active: 'valueAtLastDate', direction: 'desc'};


  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }




  ngOnInit() {
  }

  ngAfterViewInit() {
    // Load the data and apply initial sort.
    // Can only access MatSort after ViewInit so fetch the data here to guarantee matSort is available when data returns
    this.http.get<GroupedEvent[]>(this.baseUrl + 'api/groups/90').subscribe(result => {
      this.groupedEvents = result;
      this.matSort.sort({ id: this.initialSort.active, start: 'desc', disableClear: true});
    }, error => console.error(error));
  }


  // Called by MatSort to apply a sort to the data
  sortData(sort: Sort) {
    const data = this.groupedEvents.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedGroupedEvents = data;
      return;
    }
    this.sortedGroupedEvents = this.sortDataByColumn(data, sort);
  }

  sortDataByColumn(data: GroupedEvent[], sort: Sort) : GroupedEvent[] {
    const isAsc =  sort.direction === 'asc';
    return this.groupedEvents.sort((a, b) => {
      switch (sort.active) {
        case 'latestPoiDate': return compare(a.latestPoiDate, b.latestPoiDate, isAsc);
        case 'trackLocation': return compare(a.trackLocation, b.trackLocation, isAsc);
        case 'direction': return compare(a.milesDir, b.milesDir, isAsc);
        case 'numPois': return compare(a.numPois, b.numPois, isAsc);
        case 'poiCode': return compare(a.poiCode, b.poiCode, isAsc);
        case 'gradient': return compare(a.trendLine.gradient, b.trendLine.gradient, isAsc);
        case 'valueAtLastDate': return compare(a.trendLine.valueAtLastDate, b.trendLine.valueAtLastDate, isAsc);
        case 'daysSinceLastDate': return compare(a.trendLine.daysSinceLastDate, b.trendLine.daysSinceLastDate, isAsc);
        default: return 0;
      }
    });
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

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


