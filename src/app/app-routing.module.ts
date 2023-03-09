import { inject, NgModule } from '@angular/core';
import { Route, Router, RouterModule, Routes, UrlSegment } from '@angular/router';
import { ExternalCandidateDashboardComponent } from './external-candidate-dashboard/external-candidate-dashboard.component';
import { ExternalCandidateJobsComponent } from './pages/external-candidate-jobs/external-candidate-jobs.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginExternalComponent } from './pages/login-external/login-external.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RoleComponent } from './pages/role/role.component';
import { AuthService } from './services/auth.service';

const allowAccessToDashboard = (route: Route, segments: UrlSegment[]) => {
    const shouldContinueToDashboard = inject(AuthService).shouldAllowAccessToRoute();
    const router = inject(Router);
    return shouldContinueToDashboard || router.createUrlTree(['/login']);
}

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  { path: 'jobs', component: ExternalCandidateJobsComponent},
  { path: 'jobs/:category', component: ExternalCandidateJobsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signin', component: LoginExternalComponent},
  { path: 'assign-roles', component: RoleComponent},
  { path: 'dashboard', canMatch: [allowAccessToDashboard],  loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)},
  { path: 'external-applicant', component: ExternalCandidateDashboardComponent},
  { path: 'external-applicant/:email', component: ExternalCandidateDashboardComponent},
  { path: '**', component: NotFoundComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
