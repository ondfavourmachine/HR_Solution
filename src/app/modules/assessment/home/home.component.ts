import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartialObserver, Subscription } from 'rxjs';
import { AGlobusBranch, BaseResponse, RequiredQuarterFormat, tabs } from 'src/app/models/generalModels';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  tabList: tabs[] = ['Test Assessments', 'Interview Assessments'];
  globusBranches: AGlobusBranch[] = [];
  agesToUse: number[] = [];
  quartersToUse: RequiredQuarterFormat[] = [];
  destroyObs!: Subscription;
  showBackButton!: boolean;
  constructor(
    private sdm: SchedulerDateManipulationService, 
    private router: Router,
    private broadCastService: BroadCastService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
    this.agesToUse = this.sharedService.generateAges();
    this.destroyObs = this.broadCastService.changeInViewSubject$.subscribe({next: val => val == 'Single View' ? this.showBackButton = true : this.showBackButton = false,})
  }

  goBackToBatchView(){
    this.broadCastService.notifyParentComponentOfChangeInView('Batch View');
    this.showBackButton = false;
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

  ngOnDestroy(): void {
    this.destroyObs ? this.destroyObs.unsubscribe() : null;
  }

}
