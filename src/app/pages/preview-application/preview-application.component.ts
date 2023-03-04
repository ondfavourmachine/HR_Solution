import { CurrencyPipe } from '@angular/common';
import {  Component, Inject, OnInit, } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FullInterviewerDetailsAndInterviewResponse } from 'src/app/models/applicant-selection.models';
import { AnApplication, ApplicationApprovalStatus, ApprovalProcessStatuses, InformationForModal, PostAcceptanceInfo, PreviewActions, RequiredApplicantDetails } from 'src/app/models/generalModels';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/sharedServices';
import { AssessmentSheetComponent } from 'src/app/shared/assessment-sheet/assessment-sheet.component';
import { ExternalCandidateJobsComponent } from '../external-candidate-jobs/external-candidate-jobs.component';



@Component({
  selector: 'app-preview-application',
  templateUrl: './preview-application.component.html',
  styleUrls: ['./preview-application.component.scss'],
  providers: [CurrencyPipe]
})
export class PreviewApplicationComponent implements OnInit {
  role!: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformationForModal<AnApplication & RequiredApplicantDetails & PostAcceptanceInfo>,
    private sharedService: SharedService,
    private authService: AuthService,
    private dialog: MatDialog,
    private currencypipe:CurrencyPipe,
    private matDialogRef: MatDialogRef<ExternalCandidateJobsComponent>
  ) { 
  }

  ngOnInit(): void {
    console.log(this.data);
    if(Array.isArray(this.data.applicantData.certification)){
      this.data.applicantData.certification = this.data.applicantData.certification.map((elem: {certificate: string}) => elem.certificate ).join(' , ');
    }
    this.role = this.authService.getRole();
  }

  edit(){
    this.matDialogRef.close(PreviewActions.CLOSEANDEDIT);
  }

  submit(){
    this.matDialogRef.close(PreviewActions.CLOSEANDSUBMIT);
  }

  closeBtn(){
    this.matDialogRef.close();
    if(this.data.extraInfo?.callBack) this.data.extraInfo.callBack(PreviewActions.CLOSEANDDONOTHING);
  }

  triggerAcceptanceOrRejection(acceptOrReject: ApplicationApprovalStatus){
    this.matDialogRef.close();
    if(this.data.extraInfo?.callBack) this.data.extraInfo.callBack(PreviewActions.CLOSEANDSUBMIT, acceptOrReject);
  }

  get hrCommentIsPresent(): boolean{
    return 'hR_Comment' in this.data.applicantData && this.data.applicantData?.hR_Comment?.length > 1;
  }

  get checkIfApplicationHasApplicationStage(): boolean {
    return 'applicationStage' in this.data.applicantData && this.data.applicantData.applicationStage == 0 && this.data.applicantData.hR_Status == ApprovalProcessStatuses.Pending;
  }

  get isPreviewForExternalApplicant(): boolean {
    return 'applicationStage' in this.data.applicantData;
  }

  get getApprovalToDisplay(): string{
    if(this.data.applicantData.approverStatus == 'Awaiting') return 'Awaiting Approval';
    else if(this.data?.applicantData?.approverStatus == 'Approve' && this.data?.applicantData?.hR_Status != 'Rejected') return 'Accepted';
    else if (this.data.applicantData?.approverStatus == 'Pending') return 'Pending';
    else if(this.data?.applicantData?.approverStatus == 'Approve' && this.data?.applicantData?.hR_Status == 'Rejected') return 'Rejected';
    else if(this.data?.applicantData?.approverStatus == 'Rejected' && this.data?.applicantData?.hR_Status == 'Rejected') return 'Rejected';
    return 'Rejected'
  }

  get checkIfChairPersonAssessed(): boolean{
    return 'chairPersonAssessed' in this.data.applicantData;
  }

  triggerInterviewAssessmentScoreSheet(applicant: AnApplication & RequiredApplicantDetails, interviewer: Partial<FullInterviewerDetailsAndInterviewResponse>){
    const componentToShrink = document.querySelector('.preview_application') as HTMLDivElement;
    componentToShrink.classList.add('shrinkUp');
    const dataToUse: InformationForModal<AnApplication> = { 
      applicantData: applicant, extraInfo: {applicantSelectionScreen: true, extras: interviewer, interviewForm: false, callBack : () => {}}}
    const config: MatDialogConfig = {
      panelClass: 'preview_application',
      width: '45vw',
      height: '80vh',
      data: dataToUse
    }
     const dialogRef = this.dialog.open(AssessmentSheetComponent, config);
     dialogRef.afterClosed().subscribe({
      next: (val) => {
        componentToShrink.classList.remove('shrinkUp');
      },
     })
  }

  download<T extends AnApplication & RequiredApplicantDetails & PostAcceptanceInfo>(nameOfDoc: keyof T, applicantData?: T){
    const file = (applicantData as T)[nameOfDoc];
  }

  convertToCurrency(num?: number | string): string | null{
    if(!num) return ''
    if(typeof num ==  'string' ){
      const amount = num.replace(/,/g, '');
      return this.currencypipe.transform(amount, '₦')
    }
    return this.currencypipe.transform(num, '₦');
  }

}
