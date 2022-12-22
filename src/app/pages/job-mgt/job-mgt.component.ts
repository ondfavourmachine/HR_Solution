import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AGlobusBranch, AJob, DepartmentsInGlobus, InformationForApprovalModal, JobStatus, JobToBeCreated, JobType, tabs, Views } from 'src/app/models/generalModels';
import { JobsService } from 'src/app/services/jobs.service';
import { SharedService } from 'src/app/services/sharedServices';
import { ApprovalModalComponent } from 'src/app/shared/approval-modal/approval-modal.component';
import { CreateJobFormComponent } from 'src/app/shared/create-job-form/create-job-form.component';
import { SuccessfulInitiationComponent } from 'src/app/shared/successful-initiation/successful-initiation.component';

@Component({
  selector: 'app-job-mgt',
  templateUrl: './job-mgt.component.html',
  styleUrls: ['./job-mgt.component.scss']
})
export class JobMgtComponent implements OnInit {
  @ViewChild('PersonSpecifications') PersonSpecifications!: ElementRef<HTMLElement>;
  @ViewChild('ProfessionalCompetencies') ProfessionalCompetencies!: ElementRef<HTMLElement>;
  @ViewChild('Accountability') Accountability!: ElementRef<HTMLElement>;
  @ViewChild('JobObjectives') JobObjectives!: ElementRef<HTMLElement>;
  @ViewChild('BehavioralCompetencies') BehavioralCompetencies!:ElementRef<HTMLElement>;
  @ViewChild('OrganisationalCompetencies') OrganisationalCompetencies!: ElementRef<HTMLElement>;
  @ViewChild('EducationalQualifications') EducationalQualifications!: ElementRef<HTMLElement>;
  @ViewChild('Experience') Experience!: ElementRef<HTMLElement>;
  //
  @ViewChild('PersonSpecificationsTwo') PersonSpecificationsTwo!: ElementRef<HTMLElement>;
  @ViewChild('ProfessionalCompetenciesTwo') ProfessionalCompetenciesTwo!: ElementRef<HTMLElement>;
  @ViewChild('AccountabilityTwo') AccountabilityTwo!: ElementRef<HTMLElement>;
  @ViewChild('JobObjectivesTwo') JobObjectivesTwo!: ElementRef<HTMLElement>;
  @ViewChild('BehavioralCompetenciesTwo') BehavioralCompetenciesTwo!:ElementRef<HTMLElement>;
  @ViewChild('OrganisationalCompetenciesTwo') OrganisationalCompetenciesTwo!: ElementRef<HTMLElement>;
  @ViewChild('EducationalQualificationsTwo') EducationalQualificationsTwo!: ElementRef<HTMLElement>;
  @ViewChild('ExperienceTwo') ExperienceTwo!: ElementRef<HTMLElement>;
  tabList: tabs[] = ['Approved', 'Pending'];
  currentBranchInView!: string;
  views: Views = 'jobs';
  dataFromCreateJob: any={};
  locationsOfGlobus: AGlobusBranch[] = [];
  deptInGlobus: DepartmentsInGlobus[] = [];
  tabToSelect: tabs = 'Approved';
  showPendingJobs: boolean = false;
  pendingJobs: AJob[] = [];
  approvedJobs: AJob[] = [];
  jobID!: number
  constructor(private dialog: MatDialog, private sharedService: SharedService, private jobservice: JobsService) { 
    this.refresh = this.refresh.bind(this);
  }

  ngOnInit(): void {
    this.getBranchLocationsInGlobus()
    this.getDept();
    this.getPendingJobs();
    this.getApprovedJobs();
  }

  getApprovedJobs(){
    this.jobservice.getJobBasedOnStatus('Approve')
    .subscribe(
      {
        next: ({result}) => {
          this.approvedJobs = result ?? [];
        },
        error: console.error
      }
    )
  }

  handleChangeOfTab(event: tabs){
    this.tabToSelect = event;
    this.tabToSelect == 'Approved' ? this.showPendingJobs = false : this.showPendingJobs = true;
  }

  // changeTabs(tab: tabs){
    
  //   // tab == 'Approved' ? this.showPendingJobs = false : this.showPendingJobs = true;
  // }

  startCreatingJob(event: Event){
    const config: MatDialogConfig = {
      width: '80vw',
      height: '80vh',
      maxHeight: '80vh',
      panelClass: 'createJob'
    }
    const dialog = this.dialog.open(CreateJobFormComponent, config);
    dialog.afterClosed()
    .subscribe({next: (val: {viewToShow: Views, data: any}) => {
      this.views = val.viewToShow;
      this.dataFromCreateJob = {...val.data};
      this.currentBranchInView = this.locationsOfGlobus.find(elem => elem.id == parseInt(this.dataFromCreateJob?.location))?.branchName as string;
      // this.JobObjectives.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.jobObjectives));
      // this.Accountability.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.accountabilities));
      // /// seperator
      // this.ProfessionalCompetencies.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl( this.dataFromCreateJob.professionalCompetencies));
      // this.PersonSpecifications.nativeElement.insertAdjacentHTML('beforeend',this.sharedService.insertLisIntoUl( this.dataFromCreateJob.personSpecification));
      // this.BehavioralCompetencies.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.behavioralCompetencies));
      // this.OrganisationalCompetencies.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl( this.dataFromCreateJob.organisationalCompetencies));
      // this.EducationalQualifications.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.educationalQualifications));
      // this.Experience.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.experience));

      this.sharedService.insertIntoAdjacentHtmlOfElement<HTMLElement, ElementRef, string>([
        {element: this.JobObjectives, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.jobObjectives)},
        {element: this.Accountability, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.accountabilities)} ,
        {element: this.ProfessionalCompetencies, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.professionalCompetencies)},
        {element: this.PersonSpecifications, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.personSpecification)},
        {element: this.BehavioralCompetencies, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.behavioralCompetencies)},
        {element: this.OrganisationalCompetencies, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.organisationalCompetencies)},
        {element: this.EducationalQualifications, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.educationalQualifications)},
        {element:  this.Experience, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.experience)}
     ])

      this.sharedService.showAllChildren([this.JobObjectives, this.PersonSpecifications, this.Accountability, this.ProfessionalCompetencies, this.Experience, this.EducationalQualifications, this.OrganisationalCompetencies, this.BehavioralCompetencies])
    }})
  }

  getBranchLocationsInGlobus(){
    this.sharedService.getBranchesInGlobus()
    .subscribe({
      next: ({result}) => this.locationsOfGlobus = result,
      error: console.error
    })
  }

  sendJobForApproval(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    const form: Partial<JobToBeCreated> = {};
    const {jobObjectives,accountabilities,jobTitle, department, unit, reportTo,supervise, location, deadline, grade, type, category, testIsRequired, interviewIsRequired, classOfDegree, age, nysc, professionalCompetencies, behavioralCompetencies, organisationalCompetencies, personSpecification, educationalQualifications, experience} 
     = this.dataFromCreateJob;
    form.objective = jobObjectives;
    form.accountablities = accountabilities;
    form.position = jobTitle;
    form.department = this.deptInGlobus.find(elem => elem.name == department)?.id;
    form.unit = parseInt(unit);
    form.reportTo = reportTo;
    form.supervises = supervise;
    form.location = this.locationsOfGlobus.find(elem => elem.id == parseInt(location))?.id as number;
    form.deadline = deadline;
    form.grade = grade;
    form.type = JobType[type as keyof typeof JobType];
    form.category = category;
    form.slot = 5;
    form.status = JobStatus.PENDING.toString();
    form.isTestRequired = (testIsRequired as string).toLowerCase() == 'yes' ? true : false;
    form.isInterviewRequired = (interviewIsRequired as string).toLowerCase() == 'yes' ? true : false;
    form.classOfDegree = classOfDegree;
    form.age = parseInt(age);
    form.nysc = nysc;
    form.professionalCompetencies = professionalCompetencies;
    form.behavioralCompetencies = behavioralCompetencies;
    form.organisationalCompetencies = organisationalCompetencies;
    form.personSpecification = personSpecification;
    form.educationalQualifications =educationalQualifications;
    form.experience = experience;
    form.createdBy = ''

    console.log(form);
    this.sharedService.loading4button(btn, 'yes', 'Submitting, Please wait...');
    this.jobservice.createAJob(form)
    .subscribe({
      next: (val) => {
        if(!val.hasError && val.statusCode == '200'){
          this.sharedService.loading4button(btn, 'done', prevText as string);
          this.sharedService.triggerSuccessfulInitiationModal(`You have successfully initiated a Job Creation.  You will be notified when it's been treated by the approver`);
          this.views = 'jobs';
          return;
        }
        this.sharedService.errorSnackBar('An error occured during Job creation. Please try again', 'close')
      },
      error: console.error
    })
  }  

  

   async getDept(){
    const { result } = await this.sharedService.getDepartments();
      this.deptInGlobus = result;
   }

   startApprovalProcessForAJob(event: {view: Views, data: AJob}){
    if(event.view == 'approve'){
      const {position, accountablities, experience, objective, organisationalCompetencies, educationalQualifications, personSpecification, professionalCompetencies, behavioralCompetencies, 
        departmentName, unit, supervises, id, classOfDegree, reportTo, locationName, deadline, grade, typeName, category, isInterviewRequired, isTestRequired} = event.data;
        this.jobID = id;
      this.dataFromCreateJob.jobTitle = position;
      this.dataFromCreateJob.unit = unit;
      this.dataFromCreateJob.jobObjectives = objective;
      this.dataFromCreateJob.accountabilities = accountablities;
      this.dataFromCreateJob.educationalQualifications = educationalQualifications;
      this.dataFromCreateJob.personSpecification = personSpecification;
      this.dataFromCreateJob.professionalCompetencies = professionalCompetencies;
      this.dataFromCreateJob.behavioralCompetencies = behavioralCompetencies;
      this.dataFromCreateJob.department = departmentName;
      this.dataFromCreateJob.supervise = supervises;
      this.dataFromCreateJob.reportTo = reportTo;
      this.dataFromCreateJob.location = locationName;
      this.dataFromCreateJob.deadline = deadline;
      this.dataFromCreateJob.grade = grade;
      this.dataFromCreateJob.category = category;
      this.dataFromCreateJob.testIsRequired = isTestRequired ? 'Yes' : 'No';
      this.dataFromCreateJob.interviewIsRequired = isInterviewRequired ? 'Yes' : 'No';
      this.dataFromCreateJob.type =typeName;
      this.dataFromCreateJob.classOfDegree = classOfDegree;
      this.dataFromCreateJob.organisationalCompetencies = organisationalCompetencies;
      this.dataFromCreateJob.experience = experience;

      this.currentBranchInView = this.dataFromCreateJob.location;
      // this.sharedService.fillUpJobObject<JobToBeCreated ,JobToBeCreatedKeys>(this.dataFromCreateJob, 
      //   [accountablities, experience, organisationalCompetencies, 
      //   educationalQualifications, personSpecification, professionalCompetencies,
      //   behavioralCompetencies, classOfDegree, reportTo, deadline, grade,
      //   category] as JobToBeCreatedKeys[])

      // this.JobObjectivesTwo.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.jobObjectives));
      // this.AccountabilityTwo.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.accountabilities));
      /// seperator
      // this.ProfessionalCompetenciesTwo.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl( this.dataFromCreateJob.professionalCompetencies));
      // this.PersonSpecificationsTwo.nativeElement.insertAdjacentHTML('beforeend',this.sharedService.insertLisIntoUl( this.dataFromCreateJob.personSpecification));
      // this.BehavioralCompetenciesTwo.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.behavioralCompetencies));
      // this.OrganisationalCompetenciesTwo.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl( this.dataFromCreateJob.organisationalCompetencies));
      // this.EducationalQualificationsTwo.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.educationalQualifications));
      // this.ExperienceTwo.nativeElement.insertAdjacentHTML('beforeend', this.sharedService.insertLisIntoUl(this.dataFromCreateJob.experience));

      this.sharedService.insertIntoAdjacentHtmlOfElement<HTMLElement, ElementRef, string>([
         {element: this.JobObjectivesTwo, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.jobObjectives)},
         {element: this.AccountabilityTwo, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.accountabilities)} ,
         {element: this.ProfessionalCompetenciesTwo, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.professionalCompetencies)},
         {element: this.PersonSpecificationsTwo, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.personSpecification)},
         {element: this.BehavioralCompetenciesTwo, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.behavioralCompetencies)},
         {element: this.OrganisationalCompetenciesTwo, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.organisationalCompetencies)},
         {element: this.EducationalQualificationsTwo, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.educationalQualifications)},
         {element:  this.ExperienceTwo, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.experience)}
      ])
      this.sharedService.showAllChildren([this.JobObjectivesTwo, this.PersonSpecificationsTwo, this.AccountabilityTwo, this.ProfessionalCompetenciesTwo, this.ExperienceTwo, this.EducationalQualificationsTwo, this.OrganisationalCompetenciesTwo, this.BehavioralCompetenciesTwo]);
      this.views = event.view;
    }
   }

   getPendingJobs(){
    this.jobservice.getJobBasedOnStatus('Pending')
    .subscribe(
      {
        next: ({result}) => {
          this.pendingJobs = result ?? [];
        },
        error: console.error
      }
    )
  }

  startApproval(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText  = btn.textContent;
    const data: InformationForApprovalModal<string, string> = {header: 'Approve Job', button: 'Approve Job'}
    const config: MatDialogConfig = {
      width: '28vw',
      height: '38vh',
      panelClass: 'ApprovalModal',
      data
    };
    const dialog = this.dialog.open(ApprovalModalComponent, config);
    dialog.afterClosed()
    .subscribe(
      {
        next: (val) => {
          if(!val) return;
          this.sharedService.loading4button(btn, 'yes', 'Approving...');
          this.handleApprovalOfJob(btn, val, prevText as string)
        },
      }
    )
  }

  handleApprovalOfJob(btn: HTMLButtonElement, comment: string, prevText: string){
     this.jobservice.approveAJob(
      {jobId: this.jobID, comment, status: JobStatus.APPROVE}
     ).subscribe({
       next: () => {
        this.sharedService.loading4button(btn, 'done', prevText);
        this.sharedService.triggerSuccessfulInitiationModal('You have successfully approved this Job.', undefined, () => this.refresh());
       },
       error: () => {
        this.sharedService.errorSnackBar('An error occured while trying to approve job.', 'close');
        this.sharedService.loading4button(btn, 'done', prevText);
       }
     })

  } 


  refresh(){
    this.getApprovedJobs();
    this.getPendingJobs();
    this.handleChangeOfTab('Pending');
    this.views = 'jobs';
  }

}
