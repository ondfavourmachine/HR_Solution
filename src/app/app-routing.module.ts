import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalCandidateDashboardComponent } from './external-candidate-dashboard/external-candidate-dashboard.component';
import { ExternalCandidateJobsComponent } from './pages/external-candidate-jobs/external-candidate-jobs.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RoleComponent } from './pages/role/role.component';

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  { path: 'jobs', component: ExternalCandidateJobsComponent},
  { path: 'jobs/:category', component: ExternalCandidateJobsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'assign-roles', component: RoleComponent},
  { path: 'dashboard',  loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)},
  { path: 'external-applicant', component: ExternalCandidateDashboardComponent},
  { path: 'external-applicant/:email', component: ExternalCandidateDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
