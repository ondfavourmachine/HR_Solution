import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
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
import { GlobalInterceptorInterceptor } from './services/global-interceptor.interceptor';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UserIdleModule } from 'angular-user-idle';



@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ExternalCandidateJobsComponent,
    LoginComponent,
    ExternalCandidateDashboardComponent,
    RoleComponent,
    NotFoundComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    UserIdleModule.forRoot({idle: 180, timeout: 180, ping: 100})
  ],
  providers: [TitleCasePipe, DatePipe,  { 
    provide: HTTP_INTERCEPTORS, useClass: GlobalInterceptorInterceptor, multi:true
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
