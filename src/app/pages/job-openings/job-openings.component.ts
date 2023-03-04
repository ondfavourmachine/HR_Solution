import { Component, OnInit } from '@angular/core';
import { tap, map, Observable, of, lastValueFrom } from 'rxjs';
import { AGlobusBranch, AJob, JobCategories, PreviewJobDS, tabs, Views } from 'src/app/models/generalModels';
import { AuthService } from 'src/app/services/auth.service';
import { ExternalApplicantService } from 'src/app/services/external-applicant.service';
import { JobsService } from 'src/app/services/jobs.service';
import { SharedService } from 'src/app/services/sharedServices';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-job-openings',
  templateUrl: './job-openings.component.html',
  styleUrls: ['./job-openings.component.scss']
})
export class JobOpeningsComponent implements OnInit {
  approvedJobs: any[] = [];
  pendingJobs: any[] = [];
  // showPendingJobs: boolean = false;
  tabList: tabs[] = ['Available Jobs', 'Your Job Application'];
  tabToSelect: tabs = 'Available Jobs';
  isLoading: boolean = true;
  views: Views = 'jobs';
  jobs$!: Observable<AJob[]>;
  applicantEmail!: string;
  applicantsJob$!: Observable<AJob[]>;
  currentBranchInView!: string;
  objForPreviewOfJob!: PreviewJobDS;
  locationsOfGlobus: AGlobusBranch[] = [];
  showTabs: boolean = false;
  constructor(private jobService: JobsService, private authService: AuthService,private sharedService: SharedService, private externalCandidateService: ExternalApplicantService) { }

  ngOnInit(): void {
    this.applicantEmail = this.authService.getEmailOfLoggedInUser();
    this.getApprovedJobs();
    this.getBranchLocationsInGlobus();
  }

  // startApprovalProcessForAJob(){}
  getJobsAppliedForByLoggedInUser(){
    this.applicantsJob$ = this.externalCandidateService.getApplicantJobs<AJob[]>(environment.baseUrl)
    .pipe(tap(({statusCode}) => statusCode == '200' ? this.isLoading = false : this.isLoading = true),
     map(({result}) => {
      console.log(result);
      if(Array.isArray(result)){
        return result;
      }
      return [];
     })
    )
  }
  getApprovedJobs(){
    this.jobs$ = this.jobService.getJobsByCategory(JobCategories.INTERNAL)
    .pipe(tap(({statusCode}) => statusCode == '200' ? this.isLoading = false : this.isLoading = true),
     map(({result}) => {
      if(Array.isArray(result)){
        return result;
      }
       return [];
     })
    )
  }
  handleChangeOfTab(event: tabs){
    this.tabToSelect = event;
    switch(event){
      case 'Available Jobs':  
      this.getApprovedJobs();
      break;
      case 'Your Job Application':
      this.getJobsAppliedForByLoggedInUser();
      break;
    }
    
  }
  // startJobCreationProcess(){}
  // startApprovalProcessForAJob(event: any){}

  getBranchLocationsInGlobus(){
    this.sharedService.getBranchesInGlobus()
    .subscribe({
      next: ({result}) => this.locationsOfGlobus = result,
      error: console.error
    })
  }

  async gotoPreview(job: AJob, showTabs?: boolean){
    console.log(job.location);
    const res = await lastValueFrom(this.sharedService.getUnits(job.department));
    this.currentBranchInView = this.locationsOfGlobus.find(elem => elem.id == job.location)?.branchName as string;
    job['unitName'] = res.result?.find(elem => elem.unitId == job.unit)?.name as string;
    this.objForPreviewOfJob = {job, extraInfo: {currentBranchInView: this.currentBranchInView, headerText: '', showHeaderText: false}};
    this.views = 'preview';
     showTabs ? this.showTabs = showTabs: null;
  }
  sendJobForApproval(event: Event){}
}
