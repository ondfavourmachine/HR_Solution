import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { debounceTime, defer, distinctUntilChanged, fromEvent, tap } from 'rxjs';
import { RequiredQuarterFormat, SearchParams } from 'src/app/models/generalModels';
import { BroadCastService } from 'src/app/services/broad-cast.service';
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
  @ViewChild('LocalSearch', {read: ElementRef, static: true}) LocalSearch!: ElementRef<HTMLInputElement>
  constructor(private sdm: SchedulerDateManipulationService, private broadCastService: BroadCastService) {
    this.handleTextFromInput = this.handleTextFromInput.bind(this);
   }

  ngOnInit(): void {
    this.selectedQuarter = this.sdm.getCurrentQuarter() - 1;
    this.minDate = this.quartersToUse[this.selectedQuarter].startOfQuarter;
    this.maxDate = this.quartersToUse[this.selectedQuarter].endOfQuarter;
    this.range = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });
    this.range.valueChanges.subscribe(console.log);

    defer(() => fromEvent<InputEvent, HTMLInputElement>(this.LocalSearch.nativeElement, 'input', (event: Event)=> (event.target as HTMLInputElement) )
    .pipe(
      tap(event => {
        if(event.value.length < 1) this.broadCastService.broadCastSearchInformation(null);
      }),
      debounceTime(1000), distinctUntilChanged()))
    .subscribe({next: this.handleTextFromInput, error: console.error})
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

  handleTextFromInput(event: HTMLInputElement){
    console.log((this.end?.value as Date).toISOString().split('T')[0]);
    const obj: Partial<SearchParams> = {
      ApplicantName: event.value,
      StartDate: (this.start?.value as Date).toISOString().split('T')[0],
      EndDate: (this.end?.value as Date).toISOString().split('T')[0]
    }
    this.broadCastService.broadCastSearchInformation(obj);
  }

  refreshTable(event: Event){

  }

}
