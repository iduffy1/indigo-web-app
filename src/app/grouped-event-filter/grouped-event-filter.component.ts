import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventFilter } from 'src/models/event-filter';
import { GroupedEventFilter } from 'src/models/grouped-event-filter';
import { IndigoDataService } from '../indigo-data.service';


@Component({
  selector: 'app-grouped-event-filter',
  templateUrl: './grouped-event-filter.component.html',
  styleUrls: ['./grouped-event-filter.component.css']
})
export class GroupedEventFilterComponent implements OnInit {
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
    public dialogRef: MatDialogRef<GroupedEventFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupedEventFilter,
    private indigoDataService : IndigoDataService)
   {
     console.log("Grouped event filter ctor");
   }

  ngOnInit() : void {
    const NumberValidator = Validators.pattern('-?[0-9]*(\.?[0-9]+)?');

    this.form = new FormGroup({
      'event' : new FormGroup({
        'dateFrom' : new FormControl(this.data.event.dateFrom),
        'dateTo' : new FormControl(this.data.event.dateTo),
        'track' : new FormControl(this.data.event.track),
        'distFrom' : new FormControl(this.data.event.distFrom, [NumberValidator]),
        'distTo' : new FormControl(this.data.event.distTo, [NumberValidator]),
        'mileageDir' : new FormControl(this.data.event.mileageDir ?? ""),
        'eventType' : new FormControl(this.data.event.eventType ?? "")
      }),
      'tlGradientMin' : new FormControl(this.data.tlGradientMin, [NumberValidator]),
      'tlValueMin' : new FormControl(this.data.tlValueMin, [NumberValidator])
    });

    this.indigoDataService.groupedEventFilterResults.subscribe({
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
    const groupedEventFilter = this.form.value;

    console.log(groupedEventFilter);

    this.errorMessages = [];
    this.isLoading = true;
    this.indigoDataService.loadGroupedEvents(groupedEventFilter);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get getControl() {
    return this.form.controls;
  }

  get getForm() {
    return this.form;
  }


}
