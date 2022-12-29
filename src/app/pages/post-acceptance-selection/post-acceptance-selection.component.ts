import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
  selector: 'app-post-acceptance-selection',
  templateUrl: './post-acceptance-selection.component.html',
  styleUrls: ['./post-acceptance-selection.component.scss']
})
export class PostAcceptanceSelectionComponent implements OnInit, SelectionMethods {
  applicantAboutToBeAccepted!: AnApplication;
  quartersToUse: RequiredQuarterFormat[] = [];
  isLoading: boolean = false;
  statistics: Partial<ApplicantSelectionStatistics> = {};
  applicantsToBeSelected: AnApplication[] = [];
  constructor(
    private applicationSelectionService: ApplicantSelectionService, 
    private broadCast: BroadCastService,
    private dialog: MatDialog,
    private sdm: SchedulerDateManipulationService,
    private sharedService: SharedService,
  ) { 
    this.handleApplicantsFromServer = this.handleApplicantsFromServer.bind(this);
    this.triggerApprovalModalForAcceptingApplicant = this.triggerApprovalModalForAcceptingApplicant.bind(this);
    this.acceptAnApplicant = this.acceptAnApplicant.bind(this);
    this.getApplicantsForSelection = this.getApplicantsForSelection.bind(this);
  }
  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
    this.getApplicantsForSelection();
  }
  getApplicantsForSelection(): void {
    this.isLoading = true;
    const pObs: PartialObserver<ApplicantsSelectionResponse> = {
      next: this.handleApplicantsFromServer,
      error: (err) => console.log(err)
    }
    this.applicationSelectionService.getApplicants({ApplicationStage: 7, PageNumber: '1', PageSize: '10'}).subscribe(pObs);
  }
  handleApplicantsFromServer(val: ApplicantsSelectionResponse): void {
    const { accepted, all, awaiting, pending, rejected, returned, data } = val;
    this.statistics = {accepted, all, awaiting, rejected, returned, pending};
    this.broadCast.broadCastStatistics(this.statistics);
    this.isLoading = false;
    this.applicantsToBeSelected = data;
    console.log(this.applicantsToBeSelected);
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
  acceptingWasSuccessful(): void {}
  trackByFn(index: number, applicant: AnApplication) {
    return applicant.applicationRefNo; // or item.id
  }
}
