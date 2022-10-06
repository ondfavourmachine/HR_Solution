import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SharedModule } from './modules/shared/shared.module';
import { ExternalCandidateJobsComponent } from './pages/external-candidate-jobs/external-candidate-jobs.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ExternalCandidateJobsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
