import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Editor, Toolbar } from 'ngx-editor';
import { AGlobusBranch, AUNITINGLOBUS, DepartmentsInGlobus, UnitsInGlobus } from 'src/app/models/generalModels';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { JobsService } from 'src/app/services/jobs.service';
import { SharedService } from 'src/app/services/sharedServices';

interface EditorBinding {
  editor: Editor,
  html: string,
  editorToolbar: Toolbar
}

type EditorStringNames = 'jobObjectives' | 'accountabilities' | 'professionalCompetencies'
| 'behavioralCompetencies' | 'organisationalCompetencies' | 'personSpecification' 
| 'educationalQualifications' | 'experience';

type AddJobStringNames = 'jobTitle' | 'reportTo' | 'supervise' | 'grade' | 'type' | 'category'
| 'department' | 'unit' | 'location' | 'testIsRequired' | 'interviewIsRequired' | 'location'
| 'deadline' | 'classOfDegree' | 'age' | 'nysc'

@Component({
  selector: 'app-create-job-form',
  templateUrl: './create-job-form.component.html',
  styleUrls: ['./create-job-form.component.scss']
})
export class CreateJobFormComponent implements OnInit {
  editorBindings!: {[k in EditorStringNames ]: EditorBinding}; 
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
  // unitsInGlobus: AUNITINGLOBUS[] = []
  fetchingUnits: boolean  = false;
  unitsInGlobus: UnitsInGlobus[] = []
  constructor(private jobservice: JobsService, public sharedService: SharedService, private dialog: MatDialogRef<DashboardComponent>) { }

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
    }
    this.getDept();
    // this.getUnit();
    this.getBranchLocationsInGlobus()
  }

   async getDept(){
   const { result } = await this.sharedService.getDepartments();
     this.deptInGlobus = result;
  }

  // getUnit(){
  //   this.sharedService.getUnits()
  //   .subscribe({
  //     next: console.log,
  //     error: console.error
  //   })
  // }

  getBranchLocationsInGlobus(){
    this.sharedService.getBranchesInGlobus()
    .subscribe({
      next: ({result}) => this.branchesInGlobus = result,
      error: console.error
    })
  }

  showPreview(){
    const form = {
      ...Object.entries(this.editorBindings).reduce((prevObj: any, [key, value], index: number) => {
        const obj = {...prevObj};
        obj[key] = value.html;
        return obj;
      } ,{}),
      ...this.otherJobDetails
    }
    const returnRes = {viewToShow: 'preview', data: form };
    this.dialog.close(returnRes);
  }

  createJob(form: any){
    this.jobservice.createAJob(form)
    .subscribe({next: console.log, error: console.error});
  }

  closeDialog(){
    const returnRes = {viewToShow: 'jobs', data: {} };
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

