
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, PartialObserver } from 'rxjs';
import { InformationForApprovingAnAssessment,  RatingsInformationOnAnApplicant, RequiredDetailsFromInterviewChair } from 'src/app/models/assessment.models';
import { AnApplication, mimeTypes, ApplicationApprovalStatus, ApprovalProcessStatuses, InformationForModal, PreviewActions, RequiredApplicantDetails } from 'src/app/models/generalModels';
import { InterviewTypesWithNumber } from 'src/app/models/scheduleModels';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/sharedServices';
import { InterviewApprovalComponent } from '../interview-approval/interview-approval.component';
import { InterviewAssessmentDetailsComponent } from '../interview-assessment-details/interview-assessment-details.component';
@Component({
  selector: 'app-assess-applicant-modal',
  templateUrl: './assess-applicant-modal.component.html',
  styleUrls: ['./assess-applicant-modal.component.scss']
})
export class AssessApplicantModalComponent implements OnInit {
  hasUploadedScore: boolean = false;
  score: number | string = '';
  mimeTypesAndTheirPath: Record<mimeTypes, string> = {
    jpg: '../../../assets/images/images.svg',
    png: '../../../assets/images/images.svg',
    jpeg: '../../../assets/images/images.svg',
    doc: '../../../assets/images/word-doc.svg',
    docx: '../../../assets/images/word-doc.svg',
    pdf: '../../../assets/images/pdf_uploaded.svg'
  }
  file: File | undefined;
  uploadedMimeType: string = this.mimeTypesAndTheirPath['jpg'];
  statusOfScore: string = '';
  role!: string;
  interviewChairDetails: Partial<RequiredDetailsFromInterviewChair> = {
    cummulativeYearOfExperience: 0,
    currentPosition: '',
    noticePeriod: '',
    indebtness: 0,
    reasonForLeaving: '',
    expectation_Level: '',
    overallScore: 0,
    financialExpectation: 0,
    currentRenumeration: 0
  }
  answers = {
    authenticity: 'authenticity_input_0',
    intergrity: 'intergrity_input_0',
    focus: 'focus_input_0',
    drive: 'drive_input_0',
    intelligence: 'intelligence_input_0',
    communication: 'communication_input_0',
    competence: 'competence_input_0',
    experience: 'experience_input_0',
    performanceTrackRecord: 'performanceTrackRecord_input_0',
    interPersonalSkill: 'interPersonalSkill_input_0',
    leadershipSkill: 'leadershipSkill_input_0',
    jobFit: 'jobFit_input_0',
    totalScore: '0'
  }
  recommendation = ApprovalProcessStatuses.Fail;
  email!: string;
  loggedInUserHasntGradedApplicant: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformationForModal<AnApplication & RequiredApplicantDetails>,
    public sharedService: SharedService, private assessment: AssessmentService, private authService : AuthService,
     private dialog: MatDialog, private dialogRef: MatDialogRef<InterviewAssessmentDetailsComponent>,
  ) {
    
   }

  ngOnInit(): void {
    console.log(this.data)
    this.role = this.authService.getRole();
    this.email = this.authService.getEmailOfLoggedInUser();
    if(this.disableInput){
      this.interviewChairDetails = {
        ...this.data.applicantData.chairPersonInfo as unknown as RequiredDetailsFromInterviewChair
     }
     this.interviewChairDetails.indebtness = this.sharedService.reformatANumber(this.interviewChairDetails.indebtness as unknown as string);
     this.interviewChairDetails.currentRenumeration = this.sharedService.reformatANumber(this.interviewChairDetails.currentRenumeration as unknown as string);
     this.interviewChairDetails.financialExpectation = isNaN(parseInt(this.interviewChairDetails.financialExpectation as any)) ? this.interviewChairDetails.financialExpectation :  this.sharedService.reformatANumber(this.interviewChairDetails.financialExpectation as unknown as string);
    } 
    this.data!.applicantData.raters && this.data!.applicantData.raters!.findIndex(elem => elem.email == this.email) > -1 ? this.loggedInUserHasntGradedApplicant = true : null;
    this.loggedInUserHasntGradedApplicant ? this.getGradesByLoggedInUser() : null;
  }

  triggerUpload(){
    document.getElementById('uploadScore')?.click();
  }

  async getGradesByLoggedInUser(){
   const foundUser =  this.data!.applicantData.raters!.find(elem => elem.email == this.email);
   const {scheduleRef, applicationRefNo} = this.data.applicantData;
   try {
    const res = await lastValueFrom(this.assessment.getInterviewersGradingForAnApplicant({mail: foundUser!.email, scheduleRef: scheduleRef as string, applicationRef: applicationRefNo}));
   for(let key in this.answers){
    const newValue = res[key as keyof RatingsInformationOnAnApplicant];
    (this.answers as any)[key] = `${key}_input_${newValue}`;
     }
     this.answers.totalScore = res.totalScore.toString();
     this.recommendation = res.recommendation as ApprovalProcessStatuses;
   } catch (error) {
     this.sharedService.errorSnackBar(`Failed to load grades uploaded! Please try again later.`);
   }
  }

  catchSelectedFile(event: Event){
    const files: FileList = (event.target as any).files as FileList
    if(files[0].size > 2 * 1024 * 1024){
      this.sharedService.errorSnackBar('File to be uploaded cannot be more than 2MB')
      return;
    }
    const mimeTypeUploaded = this.mimeTypesAndTheirPath[files[0]?.name.split('.')[1] as mimeTypes];
    this.file = files[0];
    this.uploadedMimeType = mimeTypeUploaded;
    this.hasUploadedScore = true;
  }

 

 submitAssessment(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    this.sharedService.loading4button(btn, 'yes', 'Uploading rating...');
    const {applicationRefNo, scheduleRef} = this.data.applicantData;
    let formToSubmit: Partial<RatingsInformationOnAnApplicant> = {};
     formToSubmit = this.fillUpFormForSubmission(formToSubmit);
    formToSubmit['applicationRefNo'] = applicationRefNo;
    formToSubmit['schduleRef'] = scheduleRef;
    formToSubmit['comment'] = '';
    formToSubmit['applicantInterviewInfoID'] =  0;
    formToSubmit['recommendation'] = this.recommendation;
     this.assessment.addRatingForAnApplicantDuringInterview(formToSubmit)
    .subscribe({
      next: (val) => {
        // debugger;
        this.sharedService.loading4button(btn, 'done', prevText as string);
        this.sharedService.triggerSuccessfulInitiationModal('You have successfully Graded this applicant', 'Continue', this.data.extraInfo?.callBack);
        this.dialogRef.close(PreviewActions.CLOSEANDDONOTHING);
      },
      error: (error) => {
        this.sharedService.loading4button(btn, 'done', prevText as string);
        this.sharedService.errorSnackBar('Error occured while trying to grade this applicant');
      }
    })
  }

  fillUpFormForSubmission(formToSubmit: Partial<RatingsInformationOnAnApplicant>): Partial<RatingsInformationOnAnApplicant>{
    Object.entries(this.answers).forEach(([key, value]) => {
      if(key != 'totalScore'){
        const newValue = value.split('_')[2];
        formToSubmit[key as keyof RatingsInformationOnAnApplicant] = parseInt(newValue);
      }else{
        formToSubmit[key] = parseInt(value)
      }
    })
    return formToSubmit;
  }

  downloadFile(str: any){
    this.sharedService.downloadFile(str.split('/').slice(0, 5).join('/'));
  }


  removeUploadedFile(){
    this.file = undefined
    this.hasUploadedScore = false;
  }

  closeBtn(){
    this.dialog.closeAll();
  }

  approveOrReturnAssessment(event: Event, status: ApplicationApprovalStatus){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent as string;
    const data: InformationForApprovingAnAssessment = 
    {
      buttonText: 'Approve Assessment', 
      headingText: 'Approve assessment score', 
      typeOfAssessment: InterviewTypesWithNumber.Test_Invite
    }
    const currentlyOpenElement =  document.querySelector('.preview_application');
    currentlyOpenElement?.classList.add('shrinkUp'); 
    const config: MatDialogConfig = {
      width: '42vw',
      height: '48vh',
      maxWidth: '85vw',
      panelClass: 'InviteApproval',
      data,    
    }
    const pObs : PartialObserver<string | null | undefined> = {
      next:async (val) => {
        currentlyOpenElement?.classList.remove('shrinkUp'); 
        if(val && val!.length > 2){
          const { applicationRefNo, testScore } = this.data.applicantData;
          this.sharedService.loading4button(btn, 'yes', 'Approving...');
          try {
            const res = await lastValueFrom(this.assessment.approveTestScore(
              { applicationRefNo: applicationRefNo, status, comment: val as string}));
            this.closeBtn();
            this.sharedService.loading4button(btn, 'done', prevText as string);
            this.sharedService.triggerSuccessfulInitiationModal(`You have successfully approved applicant's test assessment`, 'Continue to Assessment', this.data.extraInfo?.callBack);
          } catch (error) {
            this.sharedService.errorSnackBar('Failed to approve assessment. Please try again later!')
            this.sharedService.loading4button(btn, 'done', prevText as string);
          }
        }
      },
      error: console.error
    }
    const feedback =this.dialog.open(InterviewApprovalComponent, config);
    feedback.afterClosed()
    .subscribe(pObs)
  }

  formatAmount(event:Event ){
    const input = event.target as HTMLInputElement;
    input.value =this.sharedService.reformatANumber(input.value.replace(/,/g, ''));
  }

  submitInterViewChairDetails(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent
    this.sharedService.loading4button(btn, 'yes', 'Sending...');
    this.interviewChairDetails.scheduleId = this.data.extraInfo?.extras.scheduleId;
    this.interviewChairDetails.applicationRef = this.data.applicantData.applicationRefNo;
    this.interviewChairDetails.currentRenumeration = parseInt((this.interviewChairDetails.currentRenumeration as unknown as string).replace(/,/g, '') as unknown as string);
    this.interviewChairDetails.cummulativeYearOfExperience = parseInt(this.interviewChairDetails.cummulativeYearOfExperience as unknown as string);
     this.assessment.addInterviewChairDetails(this.interviewChairDetails)
     .subscribe(
        {
          next: (val) => {
            if(!val.hasError){
              this.sharedService.successSnackBar(`Interview Chair's details have been recorded`);
              this.sharedService.loading4button(btn, 'done', prevText as string);
              this.dialogRef.close(PreviewActions.CLOSEANDDONOTHING);
              this.data.extraInfo?.callBack();
            }
          },
          error: (err) => {
            console.log(err);
            this.sharedService.errorSnackBar(`Failed to record interview chair's input.`);
            this.sharedService.loading4button(btn, 'done', prevText as string);
          }
        }
     )
  }

  get disableInput(): boolean{
    return 'chairPersonInfo' in this.data.applicantData && 'chairPersonAssessed' in this.data.applicantData && this.data.applicantData.chairPersonAssessed;
  }

  get enableButton(): boolean{
    return !isNaN(parseInt(this.answers.totalScore)) && parseInt(this.answers.totalScore) > 1
  }

  calculateScore(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    this.sharedService.loading4button(btn, 'yes', 'Calculating Score...');
    let formToSubmit: Partial<RatingsInformationOnAnApplicant> = {};
    let key: any;
    formToSubmit = this.fillUpFormForSubmission(formToSubmit);
    formToSubmit['comment'] = '';
    this.assessment.calculateScore(formToSubmit)
    .subscribe({
      next: (val) => {
        
        this.sharedService.loading4button(btn, 'done', prevText as string);
        this.answers.totalScore = val.toString();
      },
      error: (error) => {
        this.sharedService.loading4button(btn, 'done', prevText as string);
      }
    })
  }


  uploadApplicantTestScore(event: Event){
     const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    this.sharedService.loading4button(btn, 'yes', 'Uploading Score...');
    this.assessment.addApplicantTest({score: this.score as any, applicationRef: this.data.applicantData.applicationRefNo as any, status: ApprovalProcessStatuses.Approve})
    .subscribe({
      next: val => {
        this.sharedService.loading4button(btn, 'done', prevText as string);
        this.sharedService.triggerSuccessfulInitiationModal('You have successfully uploaded score for this applicant', 'Continue', this.data.extraInfo?.callBack);
      },
      error: error => {
        this.sharedService.loading4button(btn, 'done', prevText as string) ;
      }
    })
 }

}
