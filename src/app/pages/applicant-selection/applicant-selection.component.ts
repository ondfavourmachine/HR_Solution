
import { Component, OnInit, ViewChild } from '@angular/core';
// import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
// import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { AGlobusBranch, AnApplication, ApplicationApprovalStatus, BaseResponse, InformationForApprovalModal, InformationForModal, PreviewActions, RequiredQuarterFormat, tabs } from 'src/app/models/generalModels';
import { ApplicantSelectionService } from 'src/app/services/applicant-selection.service';
import { SharedService } from 'src/app/services/sharedServices';
import { PreviewApplicationComponent } from 'src/app/pages/preview-application/preview-application.component';
import { ApprovalModalComponent } from 'src/app/shared/approval-modal/approval-modal.component';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { HttpResponse } from '@angular/common/http';
import { ApplicantsSelectionResponse, SelectionMethods } from 'src/app/models/applicant-selection.models';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { AssessmentSheetComponent } from 'src/app/shared/assessment-sheet/assessment-sheet.component';


@Component({
  selector: 'app-applicant-selection',
  templateUrl: './applicant-selection.component.html',
  styleUrls: ['./applicant-selection.component.scss']
})
export class ApplicantSelectionComponent implements OnInit, SelectionMethods  { 
  isLoading: boolean = false;
  quartersToUse: RequiredQuarterFormat[] = [];
  globusBranches: AGlobusBranch[] = [];
 
  // range!: FormGroup;
  
  selectedQuarter!: number;
  applicantsToBeSelected: AnApplication[] = [];
  applicantAboutToBeAccepted!: AnApplication;
  constructor(
    public  sharedService: SharedService, 
    private dialog: MatDialog,
    private applicationSelectionService: ApplicantSelectionService,
    private broadCast: BroadCastService,
    private sdm: SchedulerDateManipulationService
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
    this.getGlobusBranchLocations();
    
  }

  getApplicantsForSelection(){
    this.isLoading = true;
    const pObs: PartialObserver<ApplicantsSelectionResponse> = {
      next: this.handleApplicantsFromServer,
      error: (err) => console.log(err)
    }
    this.applicationSelectionService.getApplicants({PageNumber: '1', PageSize: '15'}).subscribe(pObs);
  }

  getGlobusBranchLocations(){
    const pObs: PartialObserver<BaseResponse<AGlobusBranch[]>> = {
      next: ({result}) => this.globusBranches = result,
      error: (err) => console.log(err)
    }
    this.sharedService.getBranchesInGlobus().subscribe(pObs)
  }

  handleApplicantsFromServer(val: ApplicantsSelectionResponse){
    const { accepted, all, awaiting, pending, rejected, returned, data } = val;
    const statistics = {accepted, all, awaiting, rejected, returned, pending};
    this.broadCast.broadCastStatistics(statistics);
    this.isLoading = false;
    this.applicantsToBeSelected = data;
    // console.log(this.applicantsToBeSelected);
  }

  triggerApprovalModalForAcceptingApplicant(command: PreviewActions, acceptOrReject: ApplicationApprovalStatus){
    if(command == 2){
    const data: InformationForApprovalModal<string, string> = {
    header: 'Accept Applicant', 
    button: this.applicantAboutToBeAccepted.hR_Status == 'Pending' ? acceptOrReject == ApplicationApprovalStatus.Rejected ? 'Initiate Rejection' : 'Initiate Acceptance' : 'Approve Applicant', 
    callBack: this.acceptAnApplicant as unknown as Function}
    const config: MatDialogConfig = {
      width: '28vw',
      height: '38vh',
      panelClass: 'ApprovalModal',
      data
    };
    const dialog = this.dialog.open(ApprovalModalComponent, config);
    }
  }

  acceptAnApplicant(command: PreviewActions, comment: string){
    if(command == 2 && comment.length < 1){
      this.sharedService.errorSnackBar('Please enter a comment before accepting or rejecting!');
      return;
    }
    this.applicationSelectionService.selectAnApplicant({
      jobId: this.applicantAboutToBeAccepted.jobId,
      applicantId: this.applicantAboutToBeAccepted.applicationId,
      applicationRefNo: this.applicantAboutToBeAccepted.applicationRefNo,
      applicationStage: 0,
      status: ApplicationApprovalStatus.Approve,
      comment,
    }).subscribe({
        next:(val) => {
          if(!val.hasError)this.acceptingWasSuccessful();
           }, 
        error: (err: HttpResponse<any>) => {
          const {status} = err;
          status == 403 ? this.sharedService.errorSnackBar('You are not authorized to accept this applicant') : this.sharedService.errorSnackBar('An error occured while trying to accept applicant!');
      }
    })
  }

  acceptingWasSuccessful(){
    if(this.applicantAboutToBeAccepted.hR_Status == 'Pending'){
      this.sharedService.triggerSuccessfulInitiationModal('You have initiated selection of an applicant. You will be notified when it is approved', 'Continue to Applicant Selection', this.getApplicantsForSelection);
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
  
  gotoApplicantView(applicant: AnApplication){
    this.applicantAboutToBeAccepted = applicant;
    const data: InformationForModal<AnApplication> = { 
      applicantData: applicant, extraInfo: {applicantSelectionScreen: true, interviewForm: false, callBack : this.triggerApprovalModalForAcceptingApplicant}}
    const config: MatDialogConfig = {
      panelClass: 'preview_application',
      width: '84.5vw',
      height: '75vh',
      maxWidth: '85vw',
      data
    }
     const dialogRef = this.dialog.open(PreviewApplicationComponent, config);


    // this.applicantAboutToBeAccepted = applicant;
    // const data: InformationForModal<AnApplication> = { 
    //   applicantData: applicant, extraInfo: {applicantSelectionScreen: true, interviewForm: false, callBack : this.triggerApprovalModalForAcceptingApplicant}}
    // const config: MatDialogConfig = {
    //   panelClass: 'preview_application',
    //   width: '54vw',
    //   height: '60vh',
    // }
    //  const dialogRef = this.dialog.open(AssessmentSheetComponent, config);

    
  }

   statusToShow(applicant: AnApplication): string{
    if (applicant.approverStatus == 'Pending' && applicant.hR_Status == 'Approve') return 'Awaiting';
    if(applicant.approverStatus == 'Awaiting') return 'Awaiting';
    if (applicant.approverStatus == 'Approve' && applicant.hR_Status == 'Approve') return 'Approve';
     else return 'Pending';
  }
}



