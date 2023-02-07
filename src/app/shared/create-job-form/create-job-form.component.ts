import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Editor, Toolbar } from 'ngx-editor';
// import { throwError } from 'rxjs';
import { AddJobStringNames, AGlobusBranch, AJob, DepartmentsInGlobus, EditorStringNames, JobDraft, JobToBeCreated, JobType, UnitsInGlobus } from 'src/app/models/generalModels';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
// import { JobsService } from 'src/app/services/jobs.service';
import { SharedService } from 'src/app/services/sharedServices';

interface EditorBinding {
  editor: Editor,
  html: string,
  editorToolbar: Toolbar
}



@Component({
  selector: 'app-create-job-form',
  templateUrl: './create-job-form.component.html',
  styleUrls: ['./create-job-form.component.scss']
})
export class CreateJobFormComponent implements OnInit {
  editorBindings!: {[k in EditorStringNames ]: EditorBinding | any}; 
  otherJobDetails: {[k in AddJobStringNames]: any} = {
    jobTitle: '',
    reportTo: '',
    supervise: '',
    grade: '',
    type: '',
    category: '',
    department: '',
    unit: '',
    location: '',
    testIsRequired: 'yes',
    interviewIsRequired: 'yes',
    deadline: '',
    classOfDegree: '',
    age: '',
    nysc: ''
  }
  deptInGlobus: DepartmentsInGlobus[] = [];
  branchesInGlobus: AGlobusBranch[] = []
  fetchingUnits: boolean  = false;
  unitsInGlobus: UnitsInGlobus[] = [];
  jobDraft!: JobDraft;
  jobToBeCreatedIsADraft: boolean = false;
  draftId!: any;
  constructor(
    // private jobservice: JobsService, 
    public sharedService: SharedService, private dialog: MatDialogRef<DashboardComponent>, 
    @Inject(MAT_DIALOG_DATA) public data?: JobToBeCreated
    ) { }

  ngOnInit(): void {
    this.editorBindings = {
      jobObjectives: {
        editor: new Editor(),
        html: '',
        editorToolbar: [
          ['bold', 'italic', 'bullet_list', 'ordered_list'],
        ]
      },
      accountabilities: {
        editor: new Editor(),
        html: '',
        editorToolbar: [
          ['bold', 'italic', 'bullet_list', 'ordered_list'],
        ]
      },
      professionalCompetencies: {
        editor: new Editor(),
        html: '',
        editorToolbar: [
          ['bold', 'italic', 'bullet_list', 'ordered_list'],
        ]
      },
      behavioralCompetencies: {
        editor: new Editor(),
        html: '',
        editorToolbar: [
          ['bold', 'italic', 'bullet_list', 'ordered_list'],
        ]
      },
      organisationalCompetencies: {
        editor: new Editor(),
        html: '',
        editorToolbar: [
          ['bold', 'italic', 'bullet_list', 'ordered_list'],
        ]
      },
      personSpecification: {
        editor: new Editor(),
        html: '',
        editorToolbar: [
          ['bold', 'italic', 'bullet_list', 'ordered_list'],
        ]
      },
      educationalQualifications: {
        editor: new Editor(),
        html: '',
        editorToolbar: [
          ['bold', 'italic', 'bullet_list', 'ordered_list'],
        ]
      },
      experience: {
        editor: new Editor(),
        html: '',
        editorToolbar: [
          ['bold', 'italic', 'bullet_list', 'ordered_list'],
        ]
      }
    };
    this.getDept();
    this.getBranchLocationsInGlobus();
    this.convertJobToBeCreatedIntoJobDraft(this.data)
  }

   async getDept(){
   const { result } = await this.sharedService.getDepartments();
   this.deptInGlobus = result;
  }

 get disableOrEnableButton(): boolean{
      return this.editorBindings.jobObjectives.html.length > 5 && this.otherJobDetails.jobTitle.length > 2;
  }

  saveJobBeingCreatedAsDraft(){
    const getJobs = (obj: {[k in EditorStringNames | AddJobStringNames | keyof EditorBinding]: EditorBinding | string | any}, propertyToSelect?: EditorStringNames | AddJobStringNames | keyof EditorBinding) 
    : Record<EditorStringNames | AddJobStringNames | keyof EditorBinding, string>  => {
      return (Object.keys(obj) as Array<EditorStringNames | AddJobStringNames>).reduce((prevObj: any, key:EditorStringNames | AddJobStringNames | keyof EditorBinding) => {
        const res = obj[propertyToSelect ? propertyToSelect : key];
        if(typeof res == 'object')
         prevObj[key] =  (res as EditorBinding).html 
        else prevObj[key] = obj[key];
        return prevObj;
      }, {})
    }
    const response = getJobs(this.editorBindings as Record<EditorStringNames | AddJobStringNames | keyof EditorBinding, EditorBinding | string | any>);
    const response2 = getJobs(this.otherJobDetails as Record<EditorStringNames | AddJobStringNames | keyof EditorBinding, EditorBinding | string | any>);
     this.jobDraft ={job: {...response, ...response2}}
     return this.jobDraft;
  }

  sendDraftToParentComp(){
    const draft = this.saveJobBeingCreatedAsDraft();
    const draftToSendUp = this.convertJobDraftIntoJobToBeCreated(draft);
    this.dialog.close({viewToShow: 'jobs', data: draftToSendUp, saveDraft: true });
    this.draftId = '';
  }

  convertJobDraftIntoJobToBeCreated(draft: JobDraft): Partial<JobToBeCreated>{
    const {accountabilities: accountablities, 
          jobObjectives: objective, testIsRequired: isTestRequired, 
          jobTitle:position, interviewIsRequired: isInterviewRequired,
          department, unit, reportTo, supervise:supervises, location, deadline, grade, type,
          category, classOfDegree, age, nysc, professionalCompetencies, behavioralCompetencies, organisationalCompetencies,
          personSpecification, educationalQualifications, experience } = draft.job;

          const testRequired =  isTestRequired.toLowerCase() == 'yes' ? true : false;
          const interviewRequired = isInterviewRequired.toLowerCase() == 'yes' ? true : false; 
          const dept = department ?  this.deptInGlobus.find(elem => elem.name == department)?.id as number : 0;
          const u = isNaN(parseInt(unit.split('/')[1])) ? 0 : parseInt(unit.split('/')[1]);
          const t = JobType[type as keyof typeof JobType] ?? 1;
          const loc = location ? this.branchesInGlobus.find(elem => elem.id == parseInt(location))?.id as number : 0;
          const a = isNaN(parseInt(age)) ? 0 : parseInt(age);
          const e = experience as unknown as any;
          const status = '';
          const createdBy = '';
          const d = deadline == '' ? new Date(Date.now()).toISOString().split('T')[0] : deadline;

          let obj: Partial<JobToBeCreated> = {accountablities, objective, position, reportTo, supervises, deadline: d, grade, status, createdBy , category, 
          classOfDegree, nysc, professionalCompetencies, behavioralCompetencies, organisationalCompetencies,
          department: dept, unit: u, type: t, location: loc, age: a, experience: e,
          personSpecification, educationalQualifications, isInterviewRequired: interviewRequired, isTestRequired: testRequired, };
          this.jobDraft && !isNaN(parseInt(this.draftId)) ? obj.draftId = this.draftId : null;
    return obj;
  }

  getBranchLocationsInGlobus(){
    this.sharedService.getBranchesInGlobus()
    .subscribe({
      next: ({result}) => this.branchesInGlobus = result,
      error: console.error
    })
  }

  showPreview(){
    const form = {
      ...Object.entries(this.editorBindings).reduce((prevObj: any, [key, value]) => {
        const obj = {...prevObj};
        obj[key] = value.html;
        return obj;
      } ,{}),
      ...this.otherJobDetails
    }
    this.data != null && (this.data as unknown as AJob).hasOwnProperty('id') ? form.id = (this.data as unknown as AJob).id : null;
    const returnRes = {viewToShow: 'preview', data: form };
    this.draftId = '';
    this.dialog.close(returnRes);
  }

  convertJobToBeCreatedIntoJobDraft(job?: JobToBeCreated): void{
    console.log(job);
    if(job){
    this.editorBindings.jobObjectives.html = job.accountablities;
    this.editorBindings.accountabilities.html = job.objective;
    this.editorBindings.professionalCompetencies.html = job.professionalCompetencies;
    this.editorBindings.behavioralCompetencies.html = job.behavioralCompetencies;
    this.editorBindings.organisationalCompetencies.html = job.organisationalCompetencies;
    this.editorBindings.educationalQualifications.html = job.educationalQualifications;
    this.editorBindings.experience.html = job.experience;
    this.otherJobDetails.jobTitle = job.position;
    this.otherJobDetails.age = job.age;
    this.otherJobDetails.grade = job.grade;
    this.otherJobDetails.category = job.category;
    this.otherJobDetails.classOfDegree = job.classOfDegree;
    this.otherJobDetails.nysc = job.nysc;
    this.otherJobDetails.deadline = job.deadline;
    this.draftId = job?.id,
    this.jobToBeCreatedIsADraft = true;
    }
  }

  // createJob(form: any){
  //   this.jobservice.createAJob(form)
  //   .subscribe({next: console.log, error: console.error});
  // }

  closeDialog(){
    const returnRes = {viewToShow: 'jobs', data: {} };
    this.draftId = '';
    this.dialog.close(returnRes);
  }

  fetchUnitOfDepartment(event: Event){
     const select = event.target as HTMLSelectElement;
     const foundDept = this.deptInGlobus.find(elem => elem.name == select.value);
     this.fetchingUnits = true;
     this.sharedService.getUnits(foundDept?.id)
     .subscribe({
        next: ({result}) => {
           this.unitsInGlobus = result;
           this.fetchingUnits = false;
           this.sharedService.successSnackBar(`Units in ${foundDept?.name} was fetched successfully!`);
        },
        error: () => {
          this.fetchingUnits = false;
          this.sharedService.errorSnackBar(`Failed to fetch. Please try again!`);
        }
     })
  }

  
  ngOnDestory(): void {
    Object.values(this.editorBindings).forEach(ele => ele.editor.destroy());
  }

}

