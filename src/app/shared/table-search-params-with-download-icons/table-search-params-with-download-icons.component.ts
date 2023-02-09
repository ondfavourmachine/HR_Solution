import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { debounceTime, defer, fromEvent, tap } from 'rxjs';
import { RequiredQuarterFormat, SearchParams } from 'src/app/models/generalModels';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-table-search-params-with-download-icons',
  templateUrl: './table-search-params-with-download-icons.component.html',
  styleUrls: ['./table-search-params-with-download-icons.component.scss']
})
export class TableSearchParamsWithDownloadIconsComponent implements OnInit, OnChanges {
  @ViewChild('picker')picker!: MatDatepicker<any>;
  @Input()quartersToUse!: RequiredQuarterFormat[];
  @Input('stopLoading')stopLoading!: {stopLoading: boolean}
  @Input()callBackForLoadingData!: Function | [Function, Function];
  range!: FormGroup;
  minDate!: Date;
  maxDate!: Date;
  // selectedQuarter!: number
  @ViewChild('LocalSearch', {read: ElementRef, static: true}) LocalSearch!: ElementRef<HTMLInputElement>
  constructor(private sdm: SchedulerDateManipulationService, private sharedService: SharedService, private pagination: PaginationService, private broadCastService: BroadCastService) {
    this.handleTextFromInput = this.handleTextFromInput.bind(this);
   }

   ngOnChanges(){
    console.log(this.stopLoading);
   }

  ngOnInit(): void {
    const [first, second, ...rest] = this.sdm.generateQuartersOfCurrentYear();
    this.minDate = first;
    this.maxDate = second;
    this.range = new FormGroup({
      start: new FormControl<Date | null>(this.minDate),
      end: new FormControl<Date | null>(this.maxDate),
    });
    this.range.valueChanges.subscribe(console.log);

    defer(() => fromEvent<InputEvent, HTMLInputElement>(this.LocalSearch.nativeElement, 'input', (event: Event)=> (event.target as HTMLInputElement) )
    .pipe(
      tap(event => {
        if(event.value.length < 1) this.broadCastService.broadCastSearchInformation(null);
      }),
      debounceTime(1000)))
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

  handleTextFromInput(event: HTMLInputElement | MouseEvent){
    if(event instanceof HTMLInputElement){
      const obj: Partial<SearchParams> = {
        ApplicantName: (event as HTMLInputElement).value,
        StartDate: this.start?.value instanceof Date ? (this.start?.value as Date).toISOString().split('T')[0] : '',
        EndDate: this.end?.value instanceof Date ? (this.end?.value as Date).toISOString().split('T')[0] : '',
      }
      this.broadCastService.broadCastSearchInformation(obj);
      return;
    }
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    const inputVal = (document.getElementById('job_search_secondary') as HTMLInputElement).value;
    if((this.start?.value instanceof Date  ||  this.start?.value instanceof Date) && inputVal != ''){
      this.sharedService.loading4button(btn, 'yes', 'Fetching...')
      const obj: Partial<SearchParams> = {
        ApplicantName: inputVal,
        StartDate: this.start?.value instanceof Date ? (this.start?.value as Date).toISOString().split('T')[0] : '',
      }
      this.broadCastService.broadCastSearchInformation(obj);
      return;
    }
    
  }

  refreshTable(event: Event){
    this.stopLoading = {stopLoading: true};
    if(this.callBackForLoadingData instanceof Function) {
      this.callBackForLoadingData();
    }else{
      this.callBackForLoadingData.forEach(elem => elem())
    }
  }

}
