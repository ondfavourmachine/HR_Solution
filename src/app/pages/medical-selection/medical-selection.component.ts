import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PartialObserver, Subscription } from 'rxjs';
import { ApplicantSelectionStatistics, ApplicantsSelectionResponse, SelectionMethods } from 'src/app/models/applicant-selection.models';
import { AnApplication, ApplicationApprovalStatus, InformationForApprovalModal,PaginationMethodsForSelectionAndAssessments, InformationForModal, PreviewActions, RequiredQuarterFormat, ApprovalProcessStatuses, DownloadAsExcelAndPdfData } from 'src/app/models/generalModels';
import { ApplicantSelectionService } from 'src/app/services/applicant-selection.service';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';
import { ApprovalModalComponent } from 'src/app/shared/approval-modal/approval-modal.component';
import { PreviewApplicationComponent } from '../preview-application/preview-application.component';

@Component({
  selector: 'app-medical-selection',
  templateUrl: './medical-selection.component.html',
  styleUrls: ['./medical-selection.component.scss']
})
export class MedicalSelectionComponent implements OnInit, SelectionMethods, PaginationMethodsForSelectionAndAssessments, OnDestroy {

  applicantAboutToBeAccepted!: AnApplication;
  quartersToUse: RequiredQuarterFormat[] = [];
  isLoading: boolean = false;
  statistics: Partial<ApplicantSelectionStatistics> = {};
  applicantsToBeSelected: AnApplication[] = [];
  noOfrecords: number = 0
  useCurrentPage: boolean = false;
  destroyObs!: Subscription;
  stopLoading: {stopLoading: boolean} = {stopLoading : false};
  dataForExcelAndPdf!: DownloadAsExcelAndPdfData
  constructor(
    private applicationSelectionService: ApplicantSelectionService, 
    private broadCast: BroadCastService,
    private dialog: MatDialog,
    private sdm: SchedulerDateManipulationService,
    private sharedService: SharedService,
    public pagination: PaginationService
    
    // private router: ActivatedRoute,
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

    this.destroyObs = this.broadCast.search$.subscribe(val =>{
      if(val != null && typeof val == 'object'){
        this.isLoading = true;
       const pObs: PartialObserver<ApplicantsSelectionResponse> = {
        next: this.handleApplicantsFromServer,
        error: (err) => console.log(err)
      }
        this.applicationSelectionService.getApplicants({...val, ApplicationStage: 5, PageNumber: this.pagination.currentPage.toString(), PageSize: this.noOfrecords.toString()})
        .subscribe(pObs)
      }
      else if(val == 'reload')this.getApplicantsForSelection() 
      
    })
  }
  getApplicantsForSelection(ApplicationStage?: number, pageNumber?: number, noOfRecord?: number): void {
    this.isLoading = true;
    const pObs: PartialObserver<ApplicantsSelectionResponse> = {
      next: this.handleApplicantsFromServer,
      error: (err) => console.log(err)
    }
    this.applicationSelectionService.getApplicants({ApplicationStage: ApplicationStage ?? 5, PageNumber: pageNumber ? pageNumber.toString() : this.useCurrentPage ? this.pagination.currentPage.toString() : '1', PageSize: noOfRecord ? noOfRecord.toString() : '10'}).subscribe(pObs);
  }
  handleApplicantsFromServer(val: ApplicantsSelectionResponse): void {
    const { accepted, all, awaiting, pending, rejected, returned, data, pageSize, totalRecords } = val;
    this.statistics = {accepted, all, awaiting, rejected, returned, pending};
    this.broadCast.broadCastStatistics(this.statistics);
    this.isLoading = false;
    this.pagination.paginationData.size > 0 && this.pagination.paginationData.get(1)!.length > 0 ? this.pagination.updatePaginationData = true : this.pagination.updatePaginationData = false;
    this.pagination.calculatePagination<AnApplication>(data, totalRecords);
    this.pagination.generatePagesForView();
    this.noOfrecords = pageSize;
    this.applicantsToBeSelected = this.pagination.getAPageOfPaginatedData<AnApplication>();
    this.useCurrentPage = false;
    this.stopLoading = {stopLoading: false};
    this.setDataForPdfAndExcel();
  }

  loadNextSetOfPages(){
    const res = this.pagination.loadNextSetOfPages<AnApplication>({ApplicationStage: 5, noOfRecord: this.noOfrecords},this.getApplicantsForSelection);
    Array.isArray(res) ? this.applicantsToBeSelected = res : null;
  }
  loadPreviousSetOfPages(){
    const res = this.pagination.loadPreviousSetOfPages<AnApplication>({ApplicationStage: 5, noOfRecord: this.noOfrecords},this.getApplicantsForSelection);
    Array.isArray(res) ? this.applicantsToBeSelected = res : null;
  }

  fetchRequiredNoOfRecords(){
    this.pagination.pageLimit = this.noOfrecords;
    this.getApplicantsForSelection(this.pagination.currentPage, this.noOfrecords)
  }
  selectAPageAndInformation(pageNumber: number){
    if(this.pagination.paginationData.get(pageNumber)!.length > 0){
      this.pagination.currentPage = pageNumber;
      this.applicantsToBeSelected = this.pagination.getAPageOfPaginatedData<AnApplication>(pageNumber);
      return;
    }
    this.pagination.currentPage = pageNumber;
    this.getApplicantsForSelection(5,pageNumber);
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
            this.acceptAnApplicant(PreviewActions.CLOSEANDSUBMIT, val, acceptOrReject == 5 ? 2 : acceptOrReject == 2 ? 2 : acceptOrReject == 7 ? acceptOrReject : 3)
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
        if(!val.hasError)this.acceptingWasSuccessful(specificTypeOfApproval as ApplicationApprovalStatus);
         }, 
      error: (err: HttpResponse<any>) => {
        const {status} = err;
        status == 403 ? this.sharedService.errorSnackBar('You are not authorized to accept this applicant') : this.sharedService.errorSnackBar('An error occured while trying to accept applicant!');
      }})
  }
  acceptingWasSuccessful(typeOfApproval: ApplicationApprovalStatus): void {
    if(this.applicantAboutToBeAccepted.hR_Status == 'Pending'){
      this.useCurrentPage = true;
      this.sharedService.triggerSuccessfulInitiationModal(
        'You have initiated to pass an applicant. You will be notified when it is approved', 
        'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }

    if(this.applicantAboutToBeAccepted.hR_Status == 'Approve'){
      this.useCurrentPage = true;
      this.sharedService.triggerSuccessfulInitiationModal('You have successfully approve the decision to "Pass" the applicant to move to the next stage.', 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }
    if(this.applicantAboutToBeAccepted.hR_Status == 'Awaiting'){
      this.useCurrentPage = true;
      this.sharedService.triggerSuccessfulInitiationModal('Applicant has been approved Successfully!', 'Continue to Applicant Selection', this.getApplicantsForSelection);
    }

    if(this.applicantAboutToBeAccepted.approverStatus == 'Awaiting'){
      this.useCurrentPage = true;
      this.sharedService.triggerSuccessfulInitiationModal('Applicant has been approved Successfully!', 'Continue to Applicant Selection', this.getApplicantsForSelection);
    }
    if(this.applicantAboutToBeAccepted.approverStatus == 'Returned'){
      console.log(typeOfApproval);
    }
  }

  trackByFn(index: number, applicant: AnApplication) {
    return applicant.applicationRefNo; // or item.id
  }
   checkIfHospitalIsAvailable(applicant: AnApplication, returnType: 'boolean' | 'string'): boolean | string{
    if(returnType == 'string'){
      const val = !applicant.hospitalName ? 'Not Available' : applicant.hospitalName.split(':')[0];
      return val;
    }
    return 'hospitalName' in applicant && applicant.hospitalName != null;
  }

  setDataForPdfAndExcel(){
    const columns: string[] = ['Serial_Number', 'Applicant_Name', 'Email', 'Invitation', 'Job_Title', 'Hospital'];
    const rows =  this.applicantsToBeSelected.map((elem, index) => {
      return [
        index > 8 ? `${index + 1}` : `0${index + 1}`,
        `${elem.firstName} ${elem.middleName} ${elem.lastName}`,
        `${elem.email}`,
        `${elem.invitationStatus}`,
        `${elem.jobTitle || elem?.position}`,
        `${elem.hospitalName  }`
      ]
    })
    this.dataForExcelAndPdf = {data: this.applicantsToBeSelected, columns: columns, rows}
  }

  ngOnDestroy(): void {
    this.destroyObs ? this.destroyObs.unsubscribe() : null;
    this.pagination.clearPaginationStuff();
  }

}
