import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AJob, BaseResponse, DepartmentsInGlobus, JobAppliedForByApplicant, Views } from '../models/generalModels';
import { ExternalApplicantService } from '../services/external-applicant.service';
import { JobsService } from '../services/jobs.service';
import { SharedService } from 'src/app/services/sharedServices';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TestInviteDescriptionViewComponent } from '../pages/shared/test-invite-description-view/test-invite-description-view.component';

@Component({
  selector: 'app-external-candidate-dashboard',
  templateUrl: './external-candidate-dashboard.component.html',
  styleUrls: ['./external-candidate-dashboard.component.scss']
})
export class ExternalCandidateDashboardComponent implements OnInit {
  @ViewChild('PersonSpecificationsFour') PersonSpecificationsFour!: ElementRef<HTMLElement>;
  @ViewChild('ProfessionalCompetenciesFour') ProfessionalCompetenciesFour!: ElementRef<HTMLElement>;
  @ViewChild('AccountabilityFour') AccountabilityFour!: ElementRef<HTMLElement>;
  @ViewChild('JobObjectivesFour') JobObjectivesFour!: ElementRef<HTMLElement>;
  @ViewChild('BehavioralCompetenciesFour') BehavioralCompetenciesFour!:ElementRef<HTMLElement>;
  @ViewChild('OrganisationalCompetenciesFour') OrganisationalCompetenciesFour!: ElementRef<HTMLElement>;
  @ViewChild('EducationalQualificationsFour') EducationalQualificationsFour!: ElementRef<HTMLElement>;
  @ViewChild('ExperienceFour') ExperienceFour!: ElementRef<HTMLElement>;
  applications:JobAppliedForByApplicant[] = [];
  oneApplication!: any;
  jobsAppliedTo: AJob[] = [];
  views:Views = 'jobs';
  subView: Extract<Views, 'preview' | 'track application'> = 'preview'
  showApplicantNavigation: boolean = true;
  today: Date = new Date(Date.now());
  candidateEmail!: string
  constructor(private activatedRoute: ActivatedRoute, 
    private externalCandidateService: ExternalApplicantService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private jobService: JobsService
    ) {
      // this.applications[0].applicationStage
    this.handleJobApplicantJobs = this.handleJobApplicantJobs.bind(this);
   }

  ngOnInit(): void {
    const {email} = this.activatedRoute.snapshot.params;
    console.log(email);
    this.candidateEmail = email;
    this.getApplicantJobs(email);
  }

  getApplicantJobs(email: string){
    this.externalCandidateService.getApplicantJobs(email)
    .subscribe({next: this.handleJobApplicantJobs,error: console.error})
  }

  handleJobApplicantJobs(val: BaseResponse<JobAppliedForByApplicant[]>){
    const {result} = val;
    this.applications.push(...result);
    const jobs = this.applications.map(elem => elem.jobId);
    this.fetchJobDetailsAppliedForByApplicant(jobs)
  }

  async fetchJobDetailsAppliedForByApplicant(jobIds: Array<number>){
    const { result: depts } = await this.sharedService.getDepartments();
    const { result: branches} = await lastValueFrom(this.sharedService.getBranchesInGlobus());
    for(let id of jobIds){
      try {
        const { result } = await lastValueFrom(this.jobService.getJobByID(id));
        const dept = depts.find(elem => elem.id == result.department ) as DepartmentsInGlobus;
        const branch = branches.find(elem => elem.id == result.location);
        branch  ? result.locationName = branch.branchName : null;
        dept  ? result.departmentName = dept.name : null;
        this.jobsAppliedTo.push(result);
      } catch (error) {
        console.log(error);
      }
    }
      
  }

  handleClick(event: {view: Views, data: AJob}){
    this.oneApplication = event.data;
    const {position, accountablities, experience, objective, organisationalCompetencies, educationalQualifications, personSpecification, professionalCompetencies, behavioralCompetencies, 
      departmentName, unit, supervises, id, classOfDegree, reportTo, locationName, deadline, grade, typeName, category, isInterviewRequired, isTestRequired} = event.data;
      // this.oneApplication.jobTitle = position;
      this.oneApplication.unit = unit;
      this.oneApplication.jobObjectives = objective;
      this.oneApplication.accountabilities = accountablities;
      this.oneApplication.educationalQualifications = educationalQualifications;
      this.oneApplication.personSpecification = personSpecification;
      this.oneApplication.professionalCompetencies = professionalCompetencies;
      this.oneApplication.behavioralCompetencies = behavioralCompetencies;
      this.oneApplication.department = departmentName;
      this.oneApplication.supervise = supervises;
      this.oneApplication.reportTo = reportTo;
      this.oneApplication.location = locationName;
      this.oneApplication.deadline = deadline;
      this.oneApplication.grade = grade;
      this.oneApplication.category = category;
      this.oneApplication.testIsRequired = isTestRequired ? 'Yes' : 'No';
      this.oneApplication.interviewIsRequired = isInterviewRequired ? 'Yes' : 'No';
      this.oneApplication.type =typeName;
      this.oneApplication.classOfDegree = classOfDegree;
      this.oneApplication.organisationalCompetencies = organisationalCompetencies;
      this.oneApplication.experience = experience;
      this.oneApplication.id = id;

        this.sharedService.insertIntoAdjacentHtmlOfElement<HTMLElement, ElementRef, string>([
          {element: this.JobObjectivesFour, content: this.sharedService.insertLisIntoUl(this.oneApplication.jobObjectives)},
          {element: this.AccountabilityFour, content: this.sharedService.insertLisIntoUl(this.oneApplication.accountabilities)} ,
          {element: this.ProfessionalCompetenciesFour, content: this.sharedService.insertLisIntoUl( this.oneApplication.professionalCompetencies)},
          {element: this.PersonSpecificationsFour, content: this.sharedService.insertLisIntoUl( this.oneApplication.personSpecification)},
          {element: this.BehavioralCompetenciesFour, content: this.sharedService.insertLisIntoUl(this.oneApplication.behavioralCompetencies)},
          {element: this.OrganisationalCompetenciesFour, content: this.sharedService.insertLisIntoUl( this.oneApplication.organisationalCompetencies)},
          {element: this.EducationalQualificationsFour, content: this.sharedService.insertLisIntoUl(this.oneApplication.educationalQualifications)},
          {element:  this.ExperienceFour, content: this.sharedService.insertLisIntoUl(this.oneApplication.experience)}
       ])
       this.sharedService.showAllChildren([this.JobObjectivesFour, this.PersonSpecificationsFour, this.AccountabilityFour, this.ProfessionalCompetenciesFour, this.ExperienceFour, this.EducationalQualificationsFour, this.OrganisationalCompetenciesFour, this.BehavioralCompetenciesFour]);
    this.views = 'preview';
  }

 async showTestDetails(event: Event){
    const small = event.target as HTMLElement;
    small.textContent = 'Fetching...';
    try {
      const {result} = await lastValueFrom(this.externalCandidateService.getTestDetailsSentToApplicantsEmail(this.candidateEmail));
      small.textContent = 'View details';
      const config: MatDialogConfig = {
        width: '38vw',
        height: '42vh',
        panelClass: 'testInviteDescriptionView', 
        data: result   
      }
      this.dialog.open(TestInviteDescriptionViewComponent, config)
    } catch (error) {
      console.log(error);
      this.sharedService.errorSnackBar('Failed to fetch test details. Please try again!')
    }
  }

}
