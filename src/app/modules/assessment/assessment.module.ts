import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { TestAssessmentComponent } from './test-assessment/test-assessment.component';
import { InterviewAssessmentComponent } from './interview-assessment/interview-assessment.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  {path: '',  pathMatch: 'full', redirectTo: 'all'},
  {path: 'all', component: HomeComponent, children: [
    {
      path: '', redirectTo: 'test-assessments', pathMatch: 'full'
    }, 
    {
      path: 'test-assessments', component: TestAssessmentComponent
    },
    {
      path: 'interview-assessments', component: InterviewAssessmentComponent
    },
  ]
 }

]

@NgModule({
  declarations: [
    HomeComponent,
    TestAssessmentComponent,
    InterviewAssessmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class AssessmentModule { }
