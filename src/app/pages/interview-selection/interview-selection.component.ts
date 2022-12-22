import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { ApplicantSelectionStatistics, ApplicantsSelectionResponse, SelectionMethods } from 'src/app/models/applicant-selection.models';
import { AnApplication, PreviewActions, ApplicationApprovalStatus, RequiredQuarterFormat, InformationForModal, InformationForApprovalModal } from 'src/app/models/generalModels';
import { ApplicantSelectionService } from 'src/app/services/applicant-selection.service';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';
import { ApprovalModalComponent } from 'src/app/shared/approval-modal/approval-modal.component';
import { PreviewApplicationComponent } from '../preview-application/preview-application.component';

@Component({
  selector: 'app-interview-selection',
  templateUrl: './interview-selection.component.html',
  styleUrls: ['./interview-selection.component.scss']
})
export class InterviewSelectionComponent implements OnInit, SelectionMethods {
  applicantAboutToBeAccepted!: AnApplication;
  quartersToUse: RequiredQuarterFormat[] = [];
  isLoading: boolean = false;
  statistics: Partial<ApplicantSelectionStatistics> = {};
  applicantsToBeSelected: AnApplication[] = [];
  stage: number | undefined
  constructor(
    private applicationSelectionService: ApplicantSelectionService, 
    private broadCast: BroadCastService,
    private dialog: MatDialog,
    private sdm: SchedulerDateManipulationService,
    private sharedService: SharedService,
    private router: ActivatedRoute,
  ) {
    this.handleApplicantsFromServer = this.handleApplicantsFromServer.bind(this);
    this.triggerApprovalModalForAcceptingApplicant = this.triggerApprovalModalForAcceptingApplicant.bind(this);
    this.acceptAnApplicant = this.acceptAnApplicant.bind(this);
    this.getApplicantsForSelection = this.getApplicantsForSelection.bind(this);
    this.handleExtraStages = this.handleExtraStages.bind(this);
    router.params.subscribe(this.handleExtraStages);
   }
  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
    
  }
  getApplicantsForSelection(): void {
    this.isLoading = true;
    const pObs: PartialObserver<ApplicantsSelectionResponse> = {
      next: this.handleApplicantsFromServer,
      error: (err) => console.log(err)
    }
    this.applicationSelectionService.getApplicants({ApplicationStage: this.stage ?? 2, PageNumber: '1', PageSize: '10'}).subscribe(pObs);
  }

  handleExtraStages(val: Params){
    if('extraStages' in val){
      const {extraStages} = val;
      switch(extraStages){
        case '02':
        this.stage = 3;
        this.getApplicantsForSelection();
        break;
        case '03':
        this.stage = 4;
        this.getApplicantsForSelection();
        break; 
      }
     return;
    }
    this.getApplicantsForSelection();  
  }
  handleApplicantsFromServer(val: ApplicantsSelectionResponse): void {
    const { accepted, all, awaiting, pending, rejected, returned, data } = val;
    this.statistics = {accepted, all, awaiting, rejected, returned, pending};
    this.broadCast.broadCastStatistics(this.statistics);
    this.isLoading = false;
    this.applicantsToBeSelected = data;
  }
  gotoApplicantView(applicant: AnApplication): void {
    const data: InformationForModal<AnApplication> = { 
      applicantData: applicant, extraInfo: {applicantSelectionScreen: true, interviewForm: false, callBack : this.triggerApprovalModalForAcceptingApplicant}}
    const config: MatDialogConfig = {
      panelClass: 'preview_application',
      width: '84.5vw',
      height: '75vh',
      maxWidth: '85vw',
      data
    }
    this.applicantAboutToBeAccepted = applicant;
    this.dialog.open(PreviewApplicationComponent, config);
  }
  triggerApprovalModalForAcceptingApplicant(command: PreviewActions, acceptOrReject: ApplicationApprovalStatus): void {
    if(command == 2){
      const data: InformationForApprovalModal<string, string> = {
      header: acceptOrReject == 5  ? 'Pass Applicant' : acceptOrReject == 2 ? 'Approve Decision' : 'Fail Applicant', 
      button: acceptOrReject == 5 ? 'Pass Applicant' :  acceptOrReject == 2 ? 'Approve Decision' : 'Fail Applicant', 
      callBack: () => {}}
      const config: MatDialogConfig = {
        width: '28vw',
        height: '38vh',
        panelClass: 'ApprovalModal',
        data
      };
      const dialog = this.dialog.open(ApprovalModalComponent, config);
      dialog.afterClosed().subscribe(
        val => {
          // this is wrong,i am calling this twice and it shouldn't be so. Please fix;
            this.acceptAnApplicant(PreviewActions.CLOSEANDSUBMIT, val, acceptOrReject == 5 ? 2 : acceptOrReject == 2 ? 2 : 3)
        }
      )
      }
  }
  
  acceptAnApplicant(command: PreviewActions, comment: string, specificTypeOfApproval?:ApplicationApprovalStatus): void {
    if(command == 2 && comment.length < 1){
      this.sharedService.errorSnackBar('Please enter a comment before accepting or rejecting!');
      return;
    }
    this.applicationSelectionService.selectAnApplicant({
      jobId: this.applicantAboutToBeAccepted.jobId,
      applicantId: this.applicantAboutToBeAccepted.applicationId,
      applicationRefNo: this.applicantAboutToBeAccepted.applicationRefNo,
      applicationStage: this.applicantAboutToBeAccepted.applicationStage,
      status: specificTypeOfApproval ? specificTypeOfApproval : ApplicationApprovalStatus.Approve,
      comment,
    }).subscribe({
      next:(val) => {
        if(!val.hasError)this.acceptingWasSuccessful();
         }, 
      error: (err: HttpResponse<any>) => {
        const {status} = err;
        status == 403 ? this.sharedService.errorSnackBar('You are not authorized to accept this applicant') : this.sharedService.errorSnackBar('An error occured while trying to accept applicant!');
      }})
  }
  acceptingWasSuccessful(): void {
    if(this.applicantAboutToBeAccepted.hR_Status == 'Pending'){
      this.sharedService.triggerSuccessfulInitiationModal('You have initiated to pass an applicant. You will be notified when it is approved', 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }

    if(this.applicantAboutToBeAccepted.hR_Status == 'Approve'){
      this.sharedService.triggerSuccessfulInitiationModal('You have successfully approve the decision to "Pass" the applicant to move to the next stage.', 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }
    if(this.applicantAboutToBeAccepted.hR_Status == 'Awaiting'){
      this.sharedService.triggerSuccessfulInitiationModal('Applicant has been approved Successfully!', 'Continue to Applicant Selection', this.getApplicantsForSelection);
    }

    if(this.applicantAboutToBeAccepted.approverStatus == 'Awaiting'){
      this.sharedService.triggerSuccessfulInitiationModal('Applicant has been approved Successfully!', 'Continue to Applicant Selection', this.getApplicantsForSelection);
    }
  }

  trackByFn(index: number, applicant: AnApplication) {
    return applicant.applicationRefNo; // or item.id
  }

}
