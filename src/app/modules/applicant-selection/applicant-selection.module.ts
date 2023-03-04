import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicantSelectionComponent } from '../../pages/applicant-selection/applicant-selection.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeSelectionComponent } from 'src/app/pages/home-selection/home-selection.component';
import { TestSelectionComponent } from 'src/app/pages/test-selection/test-selection.component';
import { InterviewSelectionComponent } from 'src/app/pages/interview-selection/interview-selection.component';
import { MedicalSelectionComponent } from 'src/app/pages/medical-selection/medical-selection.component';
import { OfferSelectionComponent } from '../../pages/offer-selection/offer-selection.component';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { PostAcceptanceSelectionComponent } from '../../pages/post-acceptance-selection/post-acceptance-selection.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: HomeSelectionComponent,
    children:[
      {path: '', redirectTo: 'all applications', pathMatch: 'full'},
      {path: 'all applications', component: ApplicantSelectionComponent},
      {path: 'all applications/:jobId', component: ApplicantSelectionComponent},
      {path: 'tests', component: TestSelectionComponent},
      {path: 'tests/:jobId', component: TestSelectionComponent},
      {path: 'interviews', component: InterviewSelectionComponent},
      {path: 'interviews/:extraStages', component: InterviewSelectionComponent},
      {path: 'medical', component: MedicalSelectionComponent},
      {path: 'offer', component: OfferSelectionComponent},
      {path: 'post-acceptance', component: PostAcceptanceSelectionComponent}
    ]
  }
]

@NgModule({
  declarations: [
    ApplicantSelectionComponent,
    InterviewSelectionComponent,
    HomeSelectionComponent,
    TestSelectionComponent,
    OfferSelectionComponent,
    MedicalSelectionComponent,
    PostAcceptanceSelectionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [BroadCastService]
})
export class ApplicantSelectionModule { }
