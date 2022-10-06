import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalCandidateJobsComponent } from './pages/external-candidate-jobs/external-candidate-jobs.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  { path: 'jobs', component: ExternalCandidateJobsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
