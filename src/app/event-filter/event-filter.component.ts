import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<EventFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data : EventFilter,
    private indigoDataService : IndigoDataService)
   {}

  ngOnInit() : void {

    this.form = new FormGroup({
      'dateFrom' : new FormControl(this.data.dateFrom),
      'dateTo' : new FormControl(this.data.dateTo),
      'track' : new FormControl(this.data.track),
      'distFrom' : new FormControl(this.data.distFrom),
      'distTo' : new FormControl(this.data.distTo),
      'mileageDir' : new FormControl(this.data.mileageDir ?? ""),
      'eventType' : new FormControl(this.data.eventType ?? "")
    });

    this.indigoDataService.eventFilterResults.subscribe({
      next: results => {
        if (this.isLoading) {
          if (results.errors) {
            this.errorMessages = results.errors;
            this.isLoading = false;
          }
          else {
            this.dialogRef.close();
          }
        }
      }
    })
  }

  onSubmit() {
    const eventFilter : EventFilter = {
      dateFrom : this.form.get('dateFrom').value,
      dateTo : this.form.get('dateTo').value,
      track : this.form.get('track').value,
      distFrom : this.form.get('distFrom').value,
      distTo : this.form.get('distTo').value,
      mileageDir : this.form.get('mileageDir').value,
      eventType : this.form.get('eventType').value
    }

    console.log(eventFilter);

    this.errorMessages = [];
    this.isLoading = true;
    this.indigoDataService.loadEvents(eventFilter);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
