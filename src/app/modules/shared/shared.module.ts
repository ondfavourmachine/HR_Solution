import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from '../../shared/navigation-bar/navigation-bar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ReusableSearchComponent } from '../../shared/reusable-search/reusable-search.component';
import { CreateJobFormComponent } from '../../shared/create-job-form/create-job-form.component';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuccessfulInitiationComponent } from '../../shared/successful-initiation/successful-initiation.component';
import { ApprovalModalComponent } from '../../shared/approval-modal/approval-modal.component';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from '../../pages/side-bar/side-bar.component';
import { NavBarComponent } from '../../pages/nav-bar/nav-bar.component';
import { JobComponent } from '../../pages/job/job.component';
import { GeneralUseTabsComponent } from '../../shared/general-use-tabs/general-use-tabs.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {NgxSkeletonModule} from 'ngx-skeleton'
import { PreviewApplicationComponent } from 'src/app/pages/preview-application/preview-application.component';
import { CreateAScheduleComponent } from '../../shared/create-aschedule/create-aschedule.component';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select.component';
import { AnIndividualScheduleComponent } from '../../shared/an-individual-schedule/an-individual-schedule.component';
import { InterviewSummaryComponent } from '../../shared/interview-summary/interview-summary.component';
import { InterviewApprovalComponent } from 'src/app/shared/interview-approval/interview-approval.component';

import { GeneralSearchBarComponent } from '../../shared/general-search-bar/general-search-bar.component';
import { TableSearchParamsWithDownloadIconsComponent } from '../../shared/table-search-params-with-download-icons/table-search-params-with-download-icons.component';
import { ApplicantImageCvDetailsComponent } from '../../shared/applicant-image-cv-details/applicant-image-cv-details.component';
import { AssessApplicantModalComponent } from '../../shared/assess-applicant-modal/assess-applicant-modal.component';
import { InterviewAssessmentDetailsComponent } from '../../shared/interview-assessment-details/interview-assessment-details.component';
import { AssessmentSheetComponent } from '../../shared/assessment-sheet/assessment-sheet.component';
import { TitleStringDisplayForGradingPipe } from '../../shared/title-string-display-for-grading.pipe';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { NoContentComponent } from '../../shared/no-content/no-content.component';
import { TestInviteDescriptionViewComponent } from 'src/app/shared/test-invite-description-view/test-invite-description-view.component';
import { PostAcceptanceInformationComponent } from '../../shared/post-acceptance-information/post-acceptance-information.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NoContentToShowComponent } from '../../shared/no-content-to-show/no-content-to-show.component';
import { BatchScoreUploadComponent } from '../../shared/batch-score-upload/batch-score-upload.component';
import { PreviewJobDetailsComponent } from '../../shared/preview-job-details/preview-job-details.component';
import { ApplyForJobByInternalStaffComponent } from '../../shared/apply-for-job-by-internal-staff/apply-for-job-by-internal-staff.component';
import { TestAssessmentAuditApprovalComponent } from '../../shared/test-assessment-audit-approval/test-assessment-audit-approval.component';
import { DownloadIconsComponent } from '../../shared/download-icons/download-icons.component';
import { IdlePromptComponentComponent } from '../../shared/idle-prompt-component/idle-prompt-component.component';

@NgModule({
  declarations: [
    NavigationBarComponent,
    FooterComponent,
    ReusableSearchComponent,
    CreateJobFormComponent,
    SideBarComponent,
    JobComponent,
    PreviewApplicationComponent,
    NavBarComponent,
    SuccessfulInitiationComponent,
    ApprovalModalComponent,
    GeneralUseTabsComponent,
    CreateAScheduleComponent,
    MultiSelectComponent,
    AnIndividualScheduleComponent,
    InterviewSummaryComponent,
    InterviewApprovalComponent,
    TestInviteDescriptionViewComponent,
    GeneralSearchBarComponent,
    TableSearchParamsWithDownloadIconsComponent,
    ApplicantImageCvDetailsComponent,
    AssessApplicantModalComponent,
    InterviewAssessmentDetailsComponent,
    AssessmentSheetComponent,
    TitleStringDisplayForGradingPipe,
    LoadingSpinnerComponent,
    NoContentComponent,
    PostAcceptanceInformationComponent,
    NoContentToShowComponent,
    BatchScoreUploadComponent,
    PreviewJobDetailsComponent,
    ApplyForJobByInternalStaffComponent,
    TestAssessmentAuditApprovalComponent,
    DownloadIconsComponent,
    IdlePromptComponentComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SlickCarouselModule,
    NgxSkeletonModule,
    NgxEditorModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  exports: [
    NavigationBarComponent,
    SideBarComponent,
    GeneralUseTabsComponent,
    PreviewApplicationComponent,
    JobComponent,
    NavBarComponent,
    FooterComponent,
    ReusableSearchComponent,
    NgxEditorModule,
    SlickCarouselModule,
    FormsModule,
    MatFormFieldModule,
    NgxSkeletonModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MultiSelectComponent,
    AnIndividualScheduleComponent,
    GeneralSearchBarComponent,
    TableSearchParamsWithDownloadIconsComponent,
    ApplicantImageCvDetailsComponent,
    AssessApplicantModalComponent,
    InterviewAssessmentDetailsComponent,
    LoadingSpinnerComponent,
    NoContentComponent,
    MatSlideToggleModule,
    NoContentToShowComponent,
    PreviewJobDetailsComponent,
    DownloadIconsComponent
  ], 
  providers: [TitleStringDisplayForGradingPipe]
})
export class SharedModule { }
