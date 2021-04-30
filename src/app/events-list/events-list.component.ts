import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poi } from 'src/models/dto';
import { IndigoDataService } from '../indigo-data.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html'
})
export class EventsListComponent implements OnInit {
  public pois: Poi[];

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    private indigoDataService : IndigoDataService
    ) { }

  ngOnInit() {
    this.indigoDataService.poisChanged.subscribe({
      next : result => {
        this.pois = result;
      }
    })
  }
}

