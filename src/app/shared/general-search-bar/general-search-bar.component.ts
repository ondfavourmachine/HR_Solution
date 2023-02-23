import { Component, OnInit, Input, ChangeDetectionStrategy, Output, OnChanges, EventEmitter, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, defer, distinctUntilChanged, fromEvent, tap } from 'rxjs';
// import { PartialObserver } from 'rxjs';
import { AGlobusBranch, BaseResponse, ClassOfDegree, GeneralLookUp, JobCategories, RequiredQuarterFormat, SearchParams } from 'src/app/models/generalModels';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';
// import { ages } from 'src/app/services/small_reusable_functions';

@Component({
  selector: 'app-general-search-bar',
  templateUrl: './general-search-bar.component.html',
  styleUrls: ['./general-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralSearchBarComponent implements OnInit, OnChanges {
  @Input()quartersToUse!: RequiredQuarterFormat[];
  selectedQuarter!: number;
  @Input()states: GeneralLookUp[] | undefined;
  @Input()agesToUse!: number[];
  @Output() emitChangeEventsOnSearchParams = new EventEmitter<any>();
  @ViewChild('generalInputSearch', {read: ElementRef, static: true}) generalInputSearch!: ElementRef<HTMLInputElement>
  jobTitle!: string;
  searchParams: Partial<SearchParams> = {
    JobCategory: JobCategories.INTERNAL,
    State: '31',
    ClassOfDegree: ClassOfDegree.FIRSTCLASS,
    Age: '',
    Quarter: '',
  }
  constructor(public  sharedService: SharedService, private broadCastService: BroadCastService, private sdm: SchedulerDateManipulationService) { 
    this.handleTextFromInput = this.handleTextFromInput.bind(this);
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.searchParams.State = Array.isArray((changes['states'].currentValue)) ? (changes['states'].currentValue as GeneralLookUp[])[24].id.toString() : '';
    if(changes.hasOwnProperty('states') && changes.hasOwnProperty('agesToUse') && changes.hasOwnProperty('quartersToUse')){  
    this.searchParams.Age = Array.isArray((changes['agesToUse'].currentValue)) ? (changes['agesToUse'].currentValue as number[])[0] : '';
    this.searchParams.Quarter = Array.isArray((changes['quartersToUse'].currentValue)) ? (changes['quartersToUse'].currentValue as RequiredQuarterFormat[])![0].humanNameForQuarter: '';
    }
  }
  ngOnInit(): void {
    defer(() => fromEvent<InputEvent, HTMLInputElement>(this.generalInputSearch.nativeElement, 'input', (event: Event)=> (event.target as HTMLInputElement) )
    .pipe(
      debounceTime(1000)))
    .subscribe({next: this.handleTextFromInput, error: console.error})
    
  }

  handleSelection(){
    this.handleTextFromInput(this.generalInputSearch.nativeElement);
  }

  handleTextFromInput(input: HTMLInputElement){
    if(input.value.length < 1){
      this.broadCastService.broadCastSearchInformation('reload');
      return;
    }
    const obj = structuredClone(this.searchParams);
    const q =obj.Quarter == 'First' ? 1 : obj.Quarter == 'Second' ? 2 : obj.Quarter == 'Third' ? 3 : 4;
    obj.Quarter = q;
    obj.State == '' ? obj.State = '25' : null;
    obj['JobTitle'] = input.value;
    this.broadCastService.broadCastSearchInformation(obj);
  }

    
}
