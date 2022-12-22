import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { RequiredQuarterFormat } from 'src/app/models/generalModels';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';

@Component({
  selector: 'app-table-search-params-with-download-icons',
  templateUrl: './table-search-params-with-download-icons.component.html',
  styleUrls: ['./table-search-params-with-download-icons.component.scss']
})
export class TableSearchParamsWithDownloadIconsComponent implements OnInit {
  @ViewChild('picker')picker!: MatDatepicker<any>;
  @Input()quartersToUse!: RequiredQuarterFormat[];
  range!: FormGroup;
  minDate!: Date;
  maxDate!: Date;
  selectedQuarter!: number
  constructor(private sdm: SchedulerDateManipulationService) { }

  ngOnInit(): void {
    this.selectedQuarter = this.sdm.getCurrentQuarter() - 1;
    this.minDate = this.quartersToUse[this.selectedQuarter].startOfQuarter;
    this.maxDate = this.quartersToUse[this.selectedQuarter].endOfQuarter;
    this.range = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });
    this.range.valueChanges.subscribe(console.log);
  }

  get start():AbstractControl | null{
    return this.range.get('start')
  }


  get end():AbstractControl | null{
    return this.range.get('end')
  }

  triggerCalendarOfDatePicker(){
    this.picker.open();
  }

}
