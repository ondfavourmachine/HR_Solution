import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PartialObserver, Subscription } from 'rxjs';
import { ApplicantSelectionStatistics, ApplicantsSelectionResponse, SelectionMethods, SpecialCandidate } from 'src/app/models/applicant-selection.models';
import { AnApplication, ApplicationApprovalStatus, DownloadAsExcelAndPdfData, InformationForApprovalModal, InformationForModal, PaginationMethodsForSelectionAndAssessments, PreviewActions, RequiredQuarterFormat } from 'src/app/models/generalModels';
import { ApplicantSelectionService } from 'src/app/services/applicant-selection.service';
import { AuthService } from 'src/app/services/auth.service';
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
  destroyObs: Subscription[] = [];
  stopLoading: {stopLoading: boolean} = {stopLoading : false};
  idOfJobToLoadModal!: any;
  dataForExcelAndPdf!: DownloadAsExcelAndPdfData
  constructor(private sdm: SchedulerDateManipulationService,
     private applicationSelectionService: ApplicantSelectionService, 
     private broadCast: BroadCastService,
     private dialog: MatDialog,
     private activatedRoute: ActivatedRoute,
     public pagination: PaginationService,
     public sharedService: SharedService,
     private authService: AuthService,
     ) { 
      this.handleApplicantsFromServer = this.handleApplicantsFromServer.bind(this);
      this.triggerApprovalModalForAcceptingApplicant = this.triggerApprovalModalForAcceptingApplicant.bind(this);
      this.acceptAnApplicant = this.acceptAnApplicant.bind(this);
      this.getApplicantsForSelection = this.getApplicantsForSelection.bind(this);
      this.clearidOfJobToLoadModal = this.clearidOfJobToLoadModal.bind(this);
     }

     ngOnInit(): void {
      const res = this.sdm.generateQuartersOfCurrentYear();
      this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
      this.getApplicantsForSelection();   
      this.role = this.authService.getRole() as string;
      // refactor this with a base class that this test selection class will extend;
      this.destroyObs[0] = this.broadCast.search$.subscribe(val =>{
        if(val != null && typeof val == 'object'){
          this.isLoading = true;
          const pObs: PartialObserver<ApplicantsSelectionResponse> = {
          next: this.handleApplicantsFromServer,
          error: (err) => console.log(err)
         }
          this.applicationSelectionService.getApplicants({...val, ApplicationStage: 1, PageNumber: this.pagination.currentPage.toString(), PageSize: this.noOfRecords.toString()})
          .subscribe(pObs)
        }
        else if(val == 'reload')this.getApplicantsForSelection()    
      })

      this.idOfJobToLoadModal = this.activatedRoute.snapshot.params
      this.destroyObs[1] = this.broadCast.applicantDataHasBeenLoaded$.subscribe(val => {
        if(this.idOfJobToLoadModal && this.idOfJobToLoadModal.hasOwnProperty('jobId') && !isNaN(parseInt(this.idOfJobToLoadModal.jobId.split('_')[1]))){
          const appId = parseInt(this.idOfJobToLoadModal.jobId.split('_')[1]);
          const foundJob = this.applicantsToBeSelected.find(elem => elem.applicationId == appId);
          this.gotoApplicantView(foundJob as AnApplication);
        }
      })  
    }
    

    clearidOfJobToLoadModal(){
      this.idOfJobToLoadModal = undefined;
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
    this.stopLoading = {stopLoading: false};
    if(this.applicantsToBeSelected.length > 0) {
      this.broadCast.broadCastLoadModalInfo(true);
    }else{
      this.broadCast.broadCastLoadModalInfo(false);
    }
    this.setDataForPdfAndExcel();
  }

  triggerApprovalModalForAcceptingApplicant(command: PreviewActions, acceptOrReject: ApplicationApprovalStatus){
    // debugger;
    if(command == 2){
    const data: InformationForApprovalModal<string, string> = {
    header: acceptOrReject == 5  ? 'Pass Applicant' : acceptOrReject == 2 ? 'Approve Decision' : 'Fail Applicant', 
    button: acceptOrReject == 5 ? 'Pass Applicant' :  acceptOrReject == 2 ? 'Approve Decision' : this.role == 'Approver' && acceptOrReject == ApplicationApprovalStatus.Rejected ? 'Approve Failure' : 'Fail Applicant', 
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
          this.acceptAnApplicant(PreviewActions.CLOSEANDSUBMIT, val, acceptOrReject == 5 ? 2 : acceptOrReject == 2 ? 2 : acceptOrReject == 7 ? acceptOrReject : 3);
          acceptOrReject == 5 ? 2 : acceptOrReject == 2 ? 2 : acceptOrReject == 7 ? acceptOrReject : 3
          return;
        }
        this.acceptAnApplicant(PreviewActions.CLOSEANDSUBMIT, val, acceptOrReject == 5 ? 2 : acceptOrReject == 2 ? 2 : acceptOrReject == 7 ? acceptOrReject : 3);
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
    if(command == 2 && str && str.length < 1){
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
    if(this.applicantAboutToBeAccepted.approverStatus == 'Awaiting' && approvalType == 7){
      this.useCurrentPage = true;
      this.sharedService.triggerSuccessfulInitiationModal('Application has been returned to HRAdmin Successfully!', 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }
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

  setDataForPdfAndExcel(){
    const columns: string[] = ['Serial_Number', 'Applicant_Name', 'Email', 'Invitation', 'Job_Title', 'Score', 'Audit_Approval'];
    const rows =  this.applicantsToBeSelected.map((elem, index) => {
      return [
        index > 8 ? `${index + 1}` : `0${index + 1}`,
        `${elem.firstName} ${elem.middleName} ${elem.lastName}`,
        `${elem.email}`,
        `${elem.invitationStatus}`,
        `${elem.jobTitle || elem?.position}`,
        `${elem.score}`,
        `${elem.audit_Status}`
      ]
    })
    this.dataForExcelAndPdf = {data: this.applicantsToBeSelected, columns: columns, rows}
  }

 

  ngOnDestroy(): void {
    this.destroyObs ? this.destroyObs.forEach(elem => elem.unsubscribe()) : null;
    this.pagination.clearPaginationStuff();
  }

}
