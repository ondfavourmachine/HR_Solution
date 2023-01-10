import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { ApplicantSelectionStatistics, ApplicantsSelectionResponse, SelectionMethods, SpecialCandidate } from 'src/app/models/applicant-selection.models';
import { AnApplication, ApplicationApprovalStatus, InformationForApprovalModal, InformationForModal, PaginationMethodsForSelectionAndAssessments, PreviewActions, RequiredQuarterFormat } from 'src/app/models/generalModels';
import { ApplicantSelectionService } from 'src/app/services/applicant-selection.service';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';
import { ApprovalModalComponent } from 'src/app/shared/approval-modal/approval-modal.component';
import { PreviewApplicationComponent } from '../preview-application/preview-application.component';

@Component({
  selector: 'app-test-selection',
  templateUrl: './test-selection.component.html',
  styleUrls: ['./test-selection.component.scss'],
  
})
export class TestSelectionComponent implements OnInit, SelectionMethods, PaginationMethodsForSelectionAndAssessments, OnDestroy {
  isLoading: boolean = true;
  statistics: Partial<ApplicantSelectionStatistics> = {};
  quartersToUse: RequiredQuarterFormat[] = [];
  applicantsToBeSelected: AnApplication[] = []
  applicantAboutToBeAccepted!: AnApplication;
  noOfRecords: number = 0;
  useCurrentPage: boolean = false;
  role!: string
  constructor(private sdm: SchedulerDateManipulationService,
     private applicationSelectionService: ApplicantSelectionService, 
     private broadCast: BroadCastService,
     private dialog: MatDialog,
     public pagination: PaginationService,
     private sharedService: SharedService
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
      this.role = this.sharedService.getRole() as string;
    }

     loadNextSetOfPages(){
      const res = this.pagination.loadNextSetOfPages<AnApplication>({ApplicationStage: 1, noOfRecord: this.noOfRecords},this.getApplicantsForSelection);
      Array.isArray(res) ? this.applicantsToBeSelected = res : null;
    }
    loadPreviousSetOfPages(){
      const res = this.pagination.loadPreviousSetOfPages<AnApplication>({ApplicationStage: 1, noOfRecord: this.noOfRecords},this.getApplicantsForSelection);
      Array.isArray(res) ? this.applicantsToBeSelected = res : null;
    }
 
    fetchRequiredNoOfRecords(){
      this.pagination.pageLimit = this.noOfRecords;
      this.getApplicantsForSelection(this.pagination.currentPage, this.noOfRecords);
    }
    selectAPageAndInformation(pageNumber: number){
      if(this.pagination.paginationData.get(pageNumber)!.length > 0){
        this.pagination.currentPage = pageNumber;
        this.applicantsToBeSelected = this.pagination.getAPageOfPaginatedData<AnApplication>(pageNumber);
        return;
      }
      this.pagination.currentPage = pageNumber;
      this.getApplicantsForSelection(1,pageNumber);
    }

 

  trackByFn(index: number, applicant: AnApplication) {
    return applicant.applicationRefNo; // or item.id
  }

  getApplicantsForSelection(ApplicationStage?: number, pageNumber?: number, noOfRecord?: number){
    this.isLoading = true;
    const pObs: PartialObserver<ApplicantsSelectionResponse> = {
      next: this.handleApplicantsFromServer,
      error: (err) => console.log(err)
    }
    this.applicationSelectionService.getApplicants({ApplicationStage: ApplicationStage ?? 1, PageNumber: pageNumber ? pageNumber.toString() : this.useCurrentPage ? this.pagination.currentPage.toString() : '1', PageSize: noOfRecord ? noOfRecord.toString() : '10'}).subscribe(pObs);
  }

  handleApplicantsFromServer(val: ApplicantsSelectionResponse){
    const { accepted, all, awaiting, pending, rejected, returned, data, pageSize, totalRecords } = val;
    this.statistics = {accepted, all, awaiting, rejected, returned, pending};
    this.broadCast.broadCastStatistics(this.statistics);
    this.pagination.paginationData.size > 0 && this.pagination.paginationData.get(1)!.length > 0 ? this.pagination.updatePaginationData = true : this.pagination.updatePaginationData = false;
    this.pagination.calculatePagination<AnApplication>(data, totalRecords);
    this.pagination.generatePagesForView();
    this.isLoading = false;
    this.noOfRecords = pageSize;
    this.applicantsToBeSelected = this.pagination.getAPageOfPaginatedData<AnApplication>();
    this.useCurrentPage = false;
  }

  triggerApprovalModalForAcceptingApplicant(command: PreviewActions, acceptOrReject: ApplicationApprovalStatus){
    // debugger;
    if(command == 2){
    const data: InformationForApprovalModal<string, string> = {
    header: acceptOrReject == 5  ? 'Pass Applicant' : acceptOrReject == 2 ? 'Approve Decision' : 'Fail Applicant', 
    button: acceptOrReject == 5 ? 'Pass Applicant' :  acceptOrReject == 2 ? 'Approve Decision' : this.role == 'Approver' ? 'Approve Failure' : 'Fail Applicant', 
    shouldShowIsSpecialToggle: acceptOrReject == ApplicationApprovalStatus.Rejected ? false : true,
    // callBack: this.acceptAnApplicant as unknown as Function
  }
    const config: MatDialogConfig = {
      width: '28vw',
      height: '38vh',
      panelClass: 'ApprovalModal',
      data
    };
    const dialog = this.dialog.open(ApprovalModalComponent, config);
    dialog.afterClosed().subscribe(
      (val: SpecialCandidate | string) => {
        if(val instanceof SpecialCandidate){
          this.acceptAnApplicant(PreviewActions.CLOSEANDSUBMIT, val, acceptOrReject == 5 ? 2 : acceptOrReject == 2 ? 2 : 3)
          return;
        }
        this.acceptAnApplicant(PreviewActions.CLOSEANDSUBMIT, val, acceptOrReject == 5 ? 2 : acceptOrReject == 2 ? 2 : 3);
      }
    )
    }
  }

  gotoApplicantView(applicant: AnApplication){
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


  acceptAnApplicant(command: PreviewActions, comment: string | SpecialCandidate, specificTypeOfApproval?:ApplicationApprovalStatus){
    const str: string = comment instanceof SpecialCandidate ? comment.comment : comment
    if(command == 2 && str.length < 1){
      this.sharedService.errorSnackBar('Please enter a comment before accepting or rejecting!');
      return;
    }
    this.applicationSelectionService.selectAnApplicant({
      // jobId: this.applicantAboutToBeAccepted.jobId,
      // applicantId: this.applicantAboutToBeAccepted.applicationId,
      applicationRefNo: this.applicantAboutToBeAccepted.applicationRefNo,
      applicationStage: comment instanceof SpecialCandidate ? parseInt(comment.stageSelected) : this.applicantAboutToBeAccepted.applicationStage,
      status: specificTypeOfApproval ? specificTypeOfApproval : ApplicationApprovalStatus.Approve,
      comment : comment instanceof  SpecialCandidate ? comment.comment : str,
      isSpecial: comment instanceof SpecialCandidate ? comment.isSpecial : false
    }).subscribe({
      next:(val) => {
        if(!val.hasError)this.acceptingWasSuccessful(specificTypeOfApproval);
         }, 
      error: (err: HttpResponse<any>) => {
        const {status} = err;
        status == 403 ? this.sharedService.errorSnackBar('You are not authorized to accept this applicant') : this.sharedService.errorSnackBar('An error occured while trying to accept applicant!');
      }})
  }

  acceptingWasSuccessful(approvalType?: ApplicationApprovalStatus){
    // debugger;
    if(this.applicantAboutToBeAccepted.hR_Status == 'Pending'){
      this.useCurrentPage = true;
      const message = approvalType == (ApplicationApprovalStatus.Rejected || ApplicationApprovalStatus.Fail) ? 'You have initiated the failing of an applicant. You will be notified when it is approved' : 'You have initiated to pass an applicant. You will be notified when it is approved';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }

    if(this.applicantAboutToBeAccepted.hR_Status == 'Approve'){
      this.useCurrentPage = true;
      const message = approvalType == (ApplicationApprovalStatus.Rejected || ApplicationApprovalStatus.Fail) ? 'You have approved the decision to Fail the applicant.' : 'You have successfully approved the decision to "Pass" the applicant and move to the next stage.';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }
    if(this.applicantAboutToBeAccepted.hR_Status == 'Awaiting'){
      this.useCurrentPage = true;
      const message = approvalType == (ApplicationApprovalStatus.Rejected || ApplicationApprovalStatus.Fail) ? 'Applicant Failure has been approved successfully!' : 'Applicant has been approved Successfully!';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
    }

    if(this.applicantAboutToBeAccepted.approverStatus == 'Awaiting'){
      this.useCurrentPage = true;
      const message = approvalType == (ApplicationApprovalStatus.Rejected || ApplicationApprovalStatus.Fail) ? 'Applicant Failure has been approved Successfully!' : 'Applicant has been approved Successfully!';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
    }

    if(this.applicantAboutToBeAccepted.hR_Status == 'Rejected'){
      this.useCurrentPage = true;
      const message = 'You have approved Failure of an applicant';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }
  }

  downloadExcel(){
    this.sharedService.downloadAsExcel(this.applicantsToBeSelected, 'applicants-with-test-invites');
  }

  getClassToDisplay(applicant: AnApplication) : string{
   
    if((applicant.approverStatus == 'Awaiting' && applicant.hR_Status == 'Rejected') || applicant.hR_Status == 'Rejected' || applicant.hR_Status == 'Returned') return 'Rejected';
    if(applicant.approverStatus == 'Awaiting') return 'Waiting';
    if(applicant.approverStatus == 'Pending' || applicant.hR_Status == 'Pending' || applicant.hR_Status == '') return 'Pending';
    return 'Approved';
  }

  ngOnDestroy(): void {
    this.pagination.clearPaginationStuff();
  }

}
