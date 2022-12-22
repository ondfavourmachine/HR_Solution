import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { AGlobusBranch, BaseResponse, RequiredQuarterFormat, tabs } from 'src/app/models/generalModels';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tabList: tabs[] = ['Test Assessments', 'Interview Assessments'];
  globusBranches: AGlobusBranch[] = [];
  agesToUse: number[] = [];
  quartersToUse: RequiredQuarterFormat[] = []
  constructor(
    private sdm: SchedulerDateManipulationService, 
    private router: Router,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
    this.agesToUse = this.sharedService.generateAges();
  }

  getGlobusBranchLocations(){
    const pObs: PartialObserver<BaseResponse<AGlobusBranch[]>> = {
      next: ({result}) => this.globusBranches = result,
      error: (err) => console.log(err)
    }
    this.sharedService.getBranchesInGlobus().subscribe(pObs)
  }

  routeToAppropriateComponent(event: tabs){
    console.log(event);
    switch(event){
      case 'Interview Assessments':
      this.router.navigateByUrl('dashboard/assessment/all/interview-assessments');
      break;
      default:
      this.router.navigateByUrl('dashboard/assessment/all/test-assessments');
    }
  }

}
