import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SharedModule } from './modules/shared/shared.module';
import { ExternalCandidateJobsComponent } from './pages/external-candidate-jobs/external-candidate-jobs.component';
import { LoginComponent } from './pages/login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ExternalCandidateDashboardComponent } from './external-candidate-dashboard/external-candidate-dashboard.component';
import { RoleComponent } from './pages/role/role.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ExternalCandidateJobsComponent,
    LoginComponent,
    ExternalCandidateDashboardComponent,
    RoleComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [TitleCasePipe, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
