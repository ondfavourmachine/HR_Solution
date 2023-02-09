import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AnApplication, ApplicationApprovalStatus, InformationForApprovalModal, PreviewJobDS, tabs, Views } from 'src/app/models/generalModels';
import { JobsService } from 'src/app/services/jobs.service';
import { SharedService } from 'src/app/services/sharedServices';
import { ApplyForJobByInternalStaffComponent } from '../apply-for-job-by-internal-staff/apply-for-job-by-internal-staff.component';
import { ApprovalModalComponent } from '../approval-modal/approval-modal.component';

@Component({
  selector: 'app-preview-job-details',
  templateUrl: './preview-job-details.component.html',
  styleUrls: ['./preview-job-details.component.scss']
})
export class PreviewJobDetailsComponent implements OnInit, OnChanges {
  currentBranchInView!: string;
  today: Date = new Date(Date.now());
  views!: Views;
  applications: AnApplication[] = [];
  tabList: tabs[] = ['Job Details', 'Track application']
  @Output() goBack = new EventEmitter<Views>();
  @Output() submitJob = new EventEmitter<Event>();
  @Output() editJob = new EventEmitter<PreviewJobDS>();
  @Output() moveBackToRedirectComp = new EventEmitter<boolean>();
  @Input('data')
  data: PreviewJobDS | undefined;
  @Input('buttonText') buttonText!: string
  @Input('showTabs') showTabs: boolean = false;
  @Input('showApplicantsPanel') showApplicantsPanel!: boolean;

  @ViewChild('PersonSpecifications', {static: true}) PersonSpecifications!: ElementRef<HTMLElement>;
  @ViewChild('ProfessionalCompetencies', {static: true}) ProfessionalCompetencies!: ElementRef<HTMLElement>;
  @ViewChild('Accountability', {static: true}) Accountability!: ElementRef<HTMLElement>;
  @ViewChild('JobObjectives', {static: true}) JobObjectives!: ElementRef<HTMLElement>;
  @ViewChild('BehavioralCompetencies', {static: true}) BehavioralCompetencies!:ElementRef<HTMLElement>;
  @ViewChild('OrganisationalCompetencies', {static: true}) OrganisationalCompetencies!: ElementRef<HTMLElement>;
  @ViewChild('EducationalQualifications', {static: true}) EducationalQualifications!: ElementRef<HTMLElement>;
  @ViewChild('Experience', {static: true}) Experience!: ElementRef<HTMLElement>;
  constructor(  public sharedService: SharedService,private dialog: MatDialog, private jobservice: JobsService, private router: Router) { }

  ngOnChanges(){
    if(!this.data || typeof this.data == 'object')console.log(`data input  is an: ${this.data}`);
    if(typeof this.data == 'object' && 'job' in this.data){
      console.log(`data input  is an:`, this.data);
       this.sharedService.clearInnerHtmlOfElement<HTMLElement, ElementRef>([this.JobObjectives, this.PersonSpecifications, this.Accountability, this.ProfessionalCompetencies, this.Experience, this.EducationalQualifications, this.OrganisationalCompetencies, this.BehavioralCompetencies]);
      this.sharedService.insertIntoAdjacentHtmlOfElement<HTMLElement, ElementRef, string>([
        {element: this.JobObjectives, content: this.sharedService.insertLisIntoUl(this.data.job.jobObjectives)},
        {element: this.Accountability, content: this.sharedService.insertLisIntoUl(this.data.job.accountabilities)} ,
        {element: this.ProfessionalCompetencies, content: this.sharedService.insertLisIntoUl( this.data.job.professionalCompetencies)},
        {element: this.PersonSpecifications, content: this.sharedService.insertLisIntoUl( this.data.job.personSpecification)},
        {element: this.BehavioralCompetencies, content: this.sharedService.insertLisIntoUl(this.data.job.behavioralCompetencies)},
        {element: this.OrganisationalCompetencies, content: this.sharedService.insertLisIntoUl( this.data.job.organisationalCompetencies)},
        {element: this.EducationalQualifications, content: this.sharedService.insertLisIntoUl(this.data.job.educationalQualifications)},
        {element:  this.Experience, content: this.sharedService.insertLisIntoUl(this.data.job.experience)}
     ])
      this.sharedService.showAllChildren([this.JobObjectives, this.PersonSpecifications, this.Accountability, this.ProfessionalCompetencies, this.Experience, this.EducationalQualifications, this.OrganisationalCompetencies, this.BehavioralCompetencies]);
      return;
    }
  }

  ngOnInit(): void {
    this.views = 'jobs';
  }


  editAJob(){
    this.editJob.emit(this.data);
  }

  showAnotherView(){
    this.views = 'jobs';
    if(this.data?.extraInfo.hasRedirect) {
      this.moveBackToRedirectComp.emit(true);
    }
    this.goBack.emit(this.views);
  }

  sendJobForApproval(event: Event){
    this.submitJob.emit(event);
  }

  async handleChangeOfTab(event: any){
    switch(event){
      case 'Track application':
      await this.getMyJob(this.data?.job.id);
      this.views = 'track application';
      break;
      default:
      this.views = 'jobs'
    }
  }

  takeAction(event: Event){
    if(!this.data?.job.hasOwnProperty('id')){
        this.sendJobForApproval(event);
        return;
    }
    if(this.showApplicantsPanel){
      this.routeToApplicantSelection();
      return;
    }
    this.applyForJob();
  }

  routeToApplicantSelection(){
    this.router.navigate(['dashboard','applicant-selection', 'all applications']);
  }

  applyForJob(){
    const config: MatDialogConfig = {
      panelClass: 'create_a_schedule',
      width: '75vw',
      height: '75vh',
      data: {jobId: this.data?.job.id}
    }
    const d = this.dialog.open(ApplyForJobByInternalStaffComponent, config);
    d.afterClosed().subscribe(val => {
      if(val) this.data!.job['hasApplied']! = 1;
    })
  }

 async  getMyJob(jobId: any){
    const res = await lastValueFrom(this.jobservice.getJobOfAnInternalCandidate(jobId))
    this.applications.push(res.result[0]);
  }

  showTestDetails(event:Event, some: string){}
  // startUploadingDocuments(){}

  closeJob(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    this.sharedService.loading4button(btn, 'yes', 'Closing Job...');
      const data: InformationForApprovalModal<string, string> = {
      header: 'Reason', 
      button: 'Close Job', 
      callBack: () => {}}
      const config: MatDialogConfig = {
        width: '28vw',
        height: '38vh',
        panelClass: 'ApprovalModal',
        data
      };
      const dialog = this.dialog.open(ApprovalModalComponent, config);
      dialog.afterClosed().subscribe( async val => {
        if(!val || null){
          this.sharedService.errorSnackBar('You must give a reason for closing Job!');
          return;
        }
        try {
        const res = await lastValueFrom(this.jobservice.deleteJobs({jobId: this.data?.job.id, comment: val, status: ApplicationApprovalStatus.Approve, actionType: 1}));
        console.log(res);
        this.sharedService.loading4button(btn, 'done', prevText as string);
        this.sharedService.successSnackBar('Job deleted successfully!');
        this.showAnotherView();
        } catch (error) {
          this.sharedService.loading4button(btn, 'done', prevText as string);
        }
      })
    // this.jobservice.
  }
  



}
