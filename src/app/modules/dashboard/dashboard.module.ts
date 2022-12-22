import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import {SharedModule} from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { RoleMgtComponent } from 'src/app/pages/role-mgt/role-mgt.component';

// this is another way of passing the lazy loaded function;

const  loadAssessmentModule = async () => {
  const m = await import('../assessment/assessment.module');
  return m.AssessmentModule;
}

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'job-management',
        pathMatch: 'full'
      },
      {
        path: 'job-management',
        loadChildren: () => import('../job-mgt/job-mgt.module').then(m => m.JobMgtModule),
      },
      {
        path: 'assessment',
        loadChildren: loadAssessmentModule
      },
      {
        path: 'applicant-selection',
        loadChildren: () => import('../applicant-selection/applicant-selection.module').then(m => m.ApplicantSelectionModule),
      },
      {
        path: 'scheduler',
        loadChildren: () => import('../schedule-master/schedule-master.module').then(m => m.ScheduleMasterModule),
      },
      {
        path: 'role-mgt',
        component: RoleMgtComponent
      }
    ]
  }
]


@NgModule({
  declarations: [
    DashboardComponent,
    RoleMgtComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DashboardModule { }
