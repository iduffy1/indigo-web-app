import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventFilter } from 'src/models/event-filter';
import { IndigoDataService } from '../indigo-data.service';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.css']
})
export class EventFilterComponent implements OnInit {
  form : FormGroup;
  dateFrom : string;
  dateTo : string;
  track : string;
  distFrom : string;
  distTo : string;
  mileageDir : string;
  eventType : string;

  errorMessages : string[] = [];

  constructor(private indigoDataService : IndigoDataService) {}

  ngOnInit() : void {
    const dateTo = new Date();
    const dateFrom = new Date(dateTo.getTime() - 90*86400*1000);

    this.form = new FormGroup({
      'dateFrom' : new FormControl(dateFrom),
      'dateTo' : new FormControl(dateTo),
      'track' : new FormControl(),
      'distFrom' : new FormControl(),
      'distTo' : new FormControl(),
      'direction' : new FormControl(''),
      'eventType' : new FormControl('')
    });


  }

  onSubmit() {
    const eventFilter : EventFilter = {
      dateFrom : this.form.get('dateFrom').value,
      dateTo : this.form.get('dateTo').value,
      track : this.form.get('track').value,
      distFrom : this.form.get('distFrom').value,
      distTo : this.form.get('distTo').value,
      mileageDir : this.form.get('direction').value,
      eventType : this.form.get('eventType').value
    }

    console.log(eventFilter);

    this.errorMessages = [];
    this.indigoDataService.loadEventsFiltered(eventFilter)
      .subscribe({
        next: result => {console.log(result);} ,
        error: error => {
          this.errorMessages = error.split('\r\n') ;

        },
        complete: () => {console.log("complete");}
      });

  }
}
