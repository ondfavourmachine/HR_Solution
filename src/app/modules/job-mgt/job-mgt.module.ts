import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobMgtComponent } from '../../pages/job-mgt/job-mgt.component';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: JobMgtComponent,
  }
]

@NgModule({
  declarations: [
    JobMgtComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class JobMgtModule { }
