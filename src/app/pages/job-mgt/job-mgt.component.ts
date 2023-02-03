import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom, throwError } from 'rxjs';
import { AGlobusBranch, AJob, DepartmentsInGlobus, InformationForApprovalModal, JobCategories, JobDraft, JobStatus, JobToBeCreated, JobType, otherRelevantData, PreviewJobDS, tabs, Views, WhoIsViewing } from 'src/app/models/generalModels';
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
  // @ViewChild('PersonSpecifications') PersonSpecifications!: ElementRef<HTMLElement>;
  // @ViewChild('ProfessionalCompetencies') ProfessionalCompetencies!: ElementRef<HTMLElement>;
  // @ViewChild('Accountability') Accountability!: ElementRef<HTMLElement>;
  // @ViewChild('JobObjectives') JobObjectives!: ElementRef<HTMLElement>;
  // @ViewChild('BehavioralCompetencies') BehavioralCompetencies!:ElementRef<HTMLElement>;
  // @ViewChild('OrganisationalCompetencies') OrganisationalCompetencies!: ElementRef<HTMLElement>;
  // @ViewChild('EducationalQualifications') EducationalQualifications!: ElementRef<HTMLElement>;
  // @ViewChild('Experience') Experience!: ElementRef<HTMLElement>;
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
  dataFromCreateJob: any ={};
  locationsOfGlobus: AGlobusBranch[] = [];
  deptInGlobus: DepartmentsInGlobus[] = [];
  tabToSelect: tabs = 'Approved';
  showPendingJobs: boolean = false;
  pendingJobs: AJob[] = [];
  approvedJobs: AJob[] = [];
  jobID!: number
  isLoading: boolean = false;
  showDraftSideBar: boolean = false;
  savedDrafts: AJob[] = [];
  relevantData!: otherRelevantData;
  objForPreviewOfJob!: PreviewJobDS
  constructor(private dialog: MatDialog, public sharedService: SharedService, private jobservice: JobsService) { 
    this.refresh = this.refresh.bind(this);
  }

  ngOnInit(): void {
    this.relevantData = {category: JobCategories.INTERNAL, whoIsViewing: WhoIsViewing.OTHERPERSONS};
    this.getBranchLocationsInGlobus()
    this.getDept();
    this.getPendingJobs();
    this.getApprovedJobs();
  }

  getApprovedJobs(){
    this.isLoading = true;
    this.jobservice.getJobBasedOnStatus('Approve')
    .subscribe(
      {
        next: ({result}) => {
          this.approvedJobs = result ?? [];
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        }
      }
    )
  }

  handleChangeOfTab(event: tabs){
    this.tabToSelect = event;
    this.tabToSelect == 'Approved' ? this.showPendingJobs = false : this.showPendingJobs = true;
  }

  editJob(adraft: JobToBeCreated){
    const config: MatDialogConfig = {
      width: '80vw',
      height: '80vh',
      maxHeight: '80vh',
      disableClose: true,
      panelClass: 'createJob',
      data: adraft
    } 
    const dialog = this.dialog.open(CreateJobFormComponent, config);
    this.handleJobCreation(dialog);
    this.showDraftSideBar =false;
  }

  // changeTabs(tab: tabs){
    
  //   // tab == 'Approved' ? this.showPendingJobs = false : this.showPendingJobs = true;
  // }

  startCreatingJob(event?: Event){
    const config: MatDialogConfig = {
      width: '80vw',
      height: '80vh',
      maxHeight: '80vh',
      disableClose: true,
      panelClass: 'createJob'
    } 
    const dialog = this.dialog.open(CreateJobFormComponent, config);
    this.handleJobCreation(dialog);
  }

  // this function leads to the display of the preview page/ saving draft functionality

  handleJobCreation(dialog: MatDialogRef<CreateJobFormComponent>){
    dialog.afterClosed()
    .subscribe(
      {next: (val: {viewToShow: Views, data: any, saveDraft?: boolean}) => {
      if(val.data && !val.hasOwnProperty('saveDraft')){
        this.views = val.viewToShow;
        this.dataFromCreateJob = {...val.data};
        this.currentBranchInView = this.locationsOfGlobus.find(elem => elem.id == parseInt(this.dataFromCreateJob?.location))?.branchName as string;
        this.objForPreviewOfJob = {job: this.dataFromCreateJob, extraInfo: {currentBranchInView: this.currentBranchInView, headerText: 'Preview the Job Details Before Submitting for Approval', showHeaderText: true}}
      //   this.sharedService.insertIntoAdjacentHtmlOfElement<HTMLElement, ElementRef, string>([
      //     {element: this.JobObjectives, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.jobObjectives)},
      //     {element: this.Accountability, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.accountabilities)} ,
      //     {element: this.ProfessionalCompetencies, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.professionalCompetencies)},
      //     {element: this.PersonSpecifications, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.personSpecification)},
      //     {element: this.BehavioralCompetencies, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.behavioralCompetencies)},
      //     {element: this.OrganisationalCompetencies, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.organisationalCompetencies)},
      //     {element: this.EducationalQualifications, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.educationalQualifications)},
      //     {element:  this.Experience, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.experience)}
      //  ])
      //   this.sharedService.showAllChildren([this.JobObjectives, this.PersonSpecifications, this.Accountability, this.ProfessionalCompetencies, this.Experience, this.EducationalQualifications, this.OrganisationalCompetencies, this.BehavioralCompetencies]);
      //   return;
       }
       this.views = val.viewToShow;
       if(val.hasOwnProperty('saveDraft') && val.saveDraft) this.createJobAsDraft(event as Event, val.data);
        }
       }
     )
  }

  // calls the api that saves a job as a draft for later.

  createJobAsDraft(event: Event, job: JobToBeCreated){
    const button = this.retrievButton(event);
    let prevInnerHtml = button.innerHTML;
    this.transformButton(button, `<i class="fa fa-sync fa-spin ml-1"></i> Saving Job...`, true);
    this.jobservice.saveJobAsADraft(job)
    .subscribe({
      next: (val) => {
        if(!val.hasError && val.statusCode == '200'){
          this.sharedService.successSnackBar('Draft successfully saved!');
          this.transformButton(button, prevInnerHtml, false);
          return;
        }
        return throwError(() => new Error('Unable to create draft. Please try again later!'));
      },
      error: (err) => {
        console.log(err);
        this.transformButton(button, prevInnerHtml, false);
        this.sharedService.errorSnackBar('Unable to create draft. Please try again later');
      }
    })
  }

  transformButton(button: HTMLButtonElement, textToUse: string, transformInfo: boolean){
    if(transformInfo){
    button.classList.add('draft_class')
    button.innerHTML = textToUse;
    return;
    }
    button.innerHTML = textToUse;
    button.classList.remove('draft_class');   
  }

  retrievButton(event: Event){
    let button;
    try {
    const buttonParent = (event.target as HTMLElement).closest('.create_button') as HTMLDivElement;
    button = buttonParent!.querySelector('button') as HTMLButtonElement;
    } catch (error) {
      const buttonParent = document.querySelector('.create_button') as HTMLDivElement;
      button = buttonParent!.querySelector('button') as HTMLButtonElement;
    }
    return button;
  }

 async startJobCreationProcess(event: Event){
    const button = this.retrievButton(event);
    let prevInnerHtml = button.innerHTML;
    this.transformButton(button, `<i class="fa fa-sync fa-spin ml-1"></i> Loading Drafts..`, true);
    try {
      const {result} = await lastValueFrom(this.jobservice.checkForDrafts());
      if( !result ){
        this.startCreatingJob(event);
        this.transformButton(button, prevInnerHtml, false);
        return;
      }
      this.transformButton(button, prevInnerHtml, false);
      this.showDraftSideBar = true;
      this.savedDrafts = result;
      console.log(this.savedDrafts);
     } catch (error) {
      console.log(error);
      this.sharedService.errorSnackBar('An error occured while trying to load drafts. Please try again later!');
      this.transformButton(button, prevInnerHtml, false);
      this.startCreatingJob(event);
     }   
  }

  getBranchLocationsInGlobus(){
    this.sharedService.getBranchesInGlobus()
    .subscribe({
      next: ({result}) => this.locationsOfGlobus = result,
      error: console.error
    })
  }

  // api call is made here for approval of job to take place. it is a function that is present on the preview page.
  sendJobForApproval(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    const form: Partial<JobToBeCreated> & Partial<AJob> = {};
    const {jobObjectives,accountabilities,jobTitle, department, unit, reportTo,supervise, location, deadline, grade, type, category, testIsRequired, interviewIsRequired, classOfDegree, age, nysc, professionalCompetencies, behavioralCompetencies, organisationalCompetencies, personSpecification, educationalQualifications, experience} 
     = this.dataFromCreateJob;
    form.objective = jobObjectives;
    form.accountablities = accountabilities;
    form.position = jobTitle;
    form.department = this.deptInGlobus.find(elem => elem.name == department)?.id;
    form.unit = parseInt(unit.split('/')[1]);
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
    this.dataFromCreateJob.hasOwnProperty('id') ? form.draftId =  this.dataFromCreateJob.id : null;
    this.sharedService.loading4button(btn, 'yes', 'Submitting, Please wait...');
    this.jobservice.createAJob(form)
    .subscribe({
      next: (val) => {
        if(!val.hasError && val.statusCode == '200'){
          this.sharedService.loading4button(btn, 'done', prevText as string);
          this.sharedService.triggerSuccessfulInitiationModal(`You have successfully initiated a Job Creation.  You will be notified when it's been treated by the approver`);
          this.refresh();
          this.views = 'jobs';
          return;
        }
        this.sharedService.errorSnackBar('An error occured during Job creation. Please try again', 'close');
        throw new Error(val.info as string);
      },
      error: (error) => {
        if(error instanceof HttpErrorResponse && error.status == 403){
          this.sharedService.errorSnackBar('You do not have the right role for job creation. Please contact admin')
          this.sharedService.loading4button(btn, 'done', prevText as string);
          return;
        }
        this.sharedService.loading4button(btn, 'done', prevText as string);
      }
    })
  }  

  

   async getDept(){
    const { result } = await this.sharedService.getDepartments();
      this.deptInGlobus = result;
   }

   async startApprovalProcessForAJob(event: {view: Views, data: AJob}){
    if(event.view == 'approve'){
      const {position, accountablities, experience, department, objective, organisationalCompetencies, educationalQualifications, personSpecification, professionalCompetencies, behavioralCompetencies, 
        departmentName, unit: unitFromServer, supervises, id, classOfDegree, reportTo, locationName, deadline, grade, typeName, category, isInterviewRequired, isTestRequired} = event.data;
       try {
        // continue from here
        const res = await lastValueFrom(this.sharedService.getUnits(department));
        const foundUnit = res.result.find(unit => unit.unitId == unitFromServer);
        this.jobID = id;
        this.dataFromCreateJob.jobTitle = position;
        this.dataFromCreateJob.unit = `${foundUnit?.name}/${unitFromServer}`;
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
       } catch (error) {
         this.sharedService.errorSnackBar(`Couldn't fetch details of Departmental unit for this job. Please try again!`)
       }
    }
   }

   getPendingJobs(){
    this.isLoading = true;
    this.jobservice.getJobBasedOnStatus('Pending')
    .subscribe(
      {
        next: ({result}) => {
          this.pendingJobs = result ?? [];
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err)
        }
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

  handleCommunication(event: Views){
    this.views = event;
    this.getApprovedJobs();
    this.getPendingJobs();
    // this.objForPreviewOfJob = {}
  }

  showPreviewPage(event: {view: Views, data: AJob}){
    this.objForPreviewOfJob = {job:  event.data, extraInfo: {currentBranchInView: this.currentBranchInView, headerText: '', showHeaderText: false}};
    this.views = event.view;
  } 

  handleApprovalOfJob(btn: HTMLButtonElement, comment: string, prevText: string){
     this.jobservice.approveAJob(
      {jobId: this.jobID, comment, status: JobStatus.APPROVE}
     ).subscribe({
       next: () => {
        this.sharedService.loading4button(btn, 'done', prevText);
        this.sharedService.triggerSuccessfulInitiationModal('You have successfully approved this Job.', undefined, this.refresh);
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

  deleteDraft(draftJob: JobToBeCreated, index: number){
    this.jobservice.deleteDrafts(draftJob.id)
    .subscribe({
      next: (val) => {
        this.savedDrafts.splice(index, 1);
        this.sharedService.successSnackBar('Draft deleted successfully!');
      },
      error: (error) => {
        this.sharedService.errorSnackBar('Unable to delete draft!');
      }
    })
  }

}
