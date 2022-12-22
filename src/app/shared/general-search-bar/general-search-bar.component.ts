import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { PartialObserver } from 'rxjs';
import { AGlobusBranch, BaseResponse, RequiredQuarterFormat } from 'src/app/models/generalModels';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';
// import { ages } from 'src/app/services/small_reusable_functions';

@Component({
  selector: 'app-general-search-bar',
  templateUrl: './general-search-bar.component.html',
  styleUrls: ['./general-search-bar.component.scss']
})
export class GeneralSearchBarComponent implements OnInit, OnChanges {
  @Input()quartersToUse!: RequiredQuarterFormat[];
  selectedQuarter!: number;
  @Input()globusBranches!: AGlobusBranch[];
  @Input()agesToUse!: number[];
  constructor(public  sharedService: SharedService, private sdm: SchedulerDateManipulationService) { }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.quartersToUse);
  }
  ngOnInit(): void {
    // const res = this.sdm.generateQuartersOfCurrentYear();
    // this.quartersToUse = this.presentQuartersInHumanReadableFormat(res);
    // this.generateAges();
    
  }


    
}
