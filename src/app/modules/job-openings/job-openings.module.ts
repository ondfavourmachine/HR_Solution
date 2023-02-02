import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobOpeningsComponent } from '../../pages/job-openings/job-openings.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: JobOpeningsComponent,
  }
]

@NgModule({
  declarations: [
    JobOpeningsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class JobOpeningsModule { }
