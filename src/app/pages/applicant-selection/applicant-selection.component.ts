
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
// import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { AGlobusBranch, AnApplication, ApplicationApprovalStatus, BaseResponse, InformationForApprovalModal, InformationForModal, PaginationMethodsForSelectionAndAssessments, PreviewActions, RequiredQuarterFormat, tabs } from 'src/app/models/generalModels';
import { ApplicantSelectionService } from 'src/app/services/applicant-selection.service';
import { SharedService } from 'src/app/services/sharedServices';
import { PreviewApplicationComponent } from 'src/app/pages/preview-application/preview-application.component';
import { ApprovalModalComponent } from 'src/app/shared/approval-modal/approval-modal.component';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { HttpResponse } from '@angular/common/http';
import { ApplicantsSelectionResponse, SelectionMethods } from 'src/app/models/applicant-selection.models';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { PaginationService } from 'src/app/services/pagination.service';
import {  jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import {UserOptions} from 'jspdf-autotable';
// import { AssessmentSheetComponent } from 'src/app/shared/assessment-sheet/assessment-sheet.component';


@Component({
  selector: 'app-applicant-selection',
  templateUrl: './applicant-selection.component.html',
  styleUrls: ['./applicant-selection.component.scss'],
})
export class ApplicantSelectionComponent implements OnInit, SelectionMethods,PaginationMethodsForSelectionAndAssessments, OnDestroy  { 
  isLoading: boolean = false;
  quartersToUse: RequiredQuarterFormat[] = [];
  globusBranches: AGlobusBranch[] = [];
  noOfrecords: number = 0
  useCurrentPage : boolean =false; 
  selectedQuarter!: number;
  applicantsToBeSelected: AnApplication[] = [];
  applicantAboutToBeAccepted!: AnApplication;
  rejectionHasBeenTriggered: boolean = false;
  role!: string;
  constructor(
    public  sharedService: SharedService, 
    private dialog: MatDialog,
    private applicationSelectionService: ApplicantSelectionService,
    private broadCast: BroadCastService,
    private sdm: SchedulerDateManipulationService,
    public pagination: PaginationService
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
    this.role = this.sharedService.getRole() as string;
    
  }

  getApplicantsForSelection(ApplicationStage?: number, pageNumber?: number, noOfRecord?: number){
    this.isLoading = true;
    const pObs: PartialObserver<ApplicantsSelectionResponse> = {
      next: this.handleApplicantsFromServer,
      error: (err) => console.log(err)
    }
    this.applicationSelectionService.getApplicants({ApplicationStage: ApplicationStage ?? 0,  PageNumber: pageNumber ? pageNumber.toString() : this.useCurrentPage ? this.pagination.currentPage.toString() : '1', PageSize: noOfRecord ? noOfRecord.toString() : '10'}).subscribe(pObs);
  }

  getGlobusBranchLocations(){
    const pObs: PartialObserver<BaseResponse<AGlobusBranch[]>> = {
      next: ({result}) => this.globusBranches = result,
      error: (err) => console.log(err)
    }
    this.sharedService.getBranchesInGlobus().subscribe(pObs)
  }

  handleApplicantsFromServer(val: ApplicantsSelectionResponse){
    const { accepted, all, awaiting, pending, rejected, returned, data, pageSize, totalRecords } = val;
    const statistics = {accepted, all, awaiting, rejected, returned, pending};
    this.broadCast.broadCastStatistics(statistics);
    // debugger;
    this.pagination.paginationData.size > 0 && this.pagination.paginationData.get(1)!.length > 0 ? this.pagination.updatePaginationData = true : this.pagination.updatePaginationData = false;
    this.pagination.calculatePagination<AnApplication>(data, totalRecords);
    this.pagination.generatePagesForView();
    this.isLoading = false;
    this.noOfrecords = pageSize
    this.applicantsToBeSelected = this.pagination.getAPageOfPaginatedData<AnApplication>();
    this.useCurrentPage = false;
  }

  triggerApprovalModalForAcceptingApplicant(command: PreviewActions, acceptOrReject: ApplicationApprovalStatus){
    // debugger;
    this.rejectionHasBeenTriggered = acceptOrReject == ApplicationApprovalStatus.Rejected ? true : false;
    if(command == 2){
    const data: InformationForApprovalModal<string, string> = {
    header: this.rejectionHasBeenTriggered ? 'Reject Applicant' : 'Accept Applicant', 
    button: this.applicantAboutToBeAccepted.hR_Status == 'Pending' ? acceptOrReject == ApplicationApprovalStatus.Rejected ? 'Initiate Rejection' : 'Initiate Acceptance' : this.role == 'Approver' && acceptOrReject == ApplicationApprovalStatus.Rejected ? 'Approve Rejection' : 'Approve Applicant', 
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
    if(command == 2 &&  comment.length < 1){
      this.sharedService.errorSnackBar('Please enter a comment before accepting or rejecting!');
      return;
    }
    this.applicationSelectionService.selectAnApplicant({
      jobId: this.applicantAboutToBeAccepted.jobId,
      applicantId: this.applicantAboutToBeAccepted.applicationId,
      applicationRefNo: this.applicantAboutToBeAccepted.applicationRefNo,
      applicationStage: 0,
      status: this.rejectionHasBeenTriggered ? ApplicationApprovalStatus.Rejected :  ApplicationApprovalStatus.Approve,
      comment,
    }).subscribe({
        next:(val) => {
          if(!val.hasError)this.acceptingWasSuccessful();
           }, 
        error: (err: HttpResponse<any>) => {
          const {status} = err;
          status == 403 ? this.sharedService.errorSnackBar('You are not authorized to accept or reject this applicant') : this.sharedService.errorSnackBar('An error occured while trying to accept applicant!');
      }
    })
  }

  acceptingWasSuccessful(){
    if(this.applicantAboutToBeAccepted.hR_Status == 'Pending'){
      this.useCurrentPage = true;
      const message = this.rejectionHasBeenTriggered ? 'You have initiated rejection of an applicant. You will be notified when it is approved' : 'You have initiated selection of an applicant. You will be notified when it is approved';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
    }
    if(this.applicantAboutToBeAccepted.hR_Status == 'Awaiting'){
      this.useCurrentPage = true;
      const message = this.rejectionHasBeenTriggered ? 'Applicant has been rejected Successfully!' : 'Applicant has been approved Successfully!';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
    }
    if(this.applicantAboutToBeAccepted.approverStatus == 'Awaiting'){
      this.useCurrentPage = true;
      const message = this.rejectionHasBeenTriggered ? 'Applicant has been rejected Successfully!' : 'Applicant has been approved Successfully!';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
    }
    if(this.applicantAboutToBeAccepted.hR_Status == 'Rejected'){
      this.useCurrentPage = true;
      const message = 'You have approved rejection of an applicant';
      this.sharedService.triggerSuccessfulInitiationModal(message, 'Continue to Applicant Selection', this.getApplicantsForSelection);
      return;
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
     this.dialog.open(PreviewApplicationComponent, config);


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

  loadNextSetOfPages(){
    const res = this.pagination.loadNextSetOfPages<AnApplication>(
      {ApplicationStage: 0, noOfRecord: this.noOfrecords},
      this.getApplicantsForSelection);
    Array.isArray(res) ? this.applicantsToBeSelected = res : null;
  }

  selectAPageAndInformation(pageNumber: number){
    if(this.pagination.paginationData.get(pageNumber)!.length > 0){
      this.pagination.currentPage = pageNumber;
      this.applicantsToBeSelected = this.pagination.getAPageOfPaginatedData<AnApplication>(pageNumber);
      return;
    }
    this.pagination.currentPage = pageNumber;
    this.getApplicantsForSelection(0, pageNumber);
  }

  fetchRequiredNoOfRecords(){
    this.pagination.pageLimit = this.noOfrecords;
    this.getApplicantsForSelection(this.pagination.currentPage, this.noOfrecords)
  }

  loadPreviousSetOfPages(){
    const res = this.pagination.loadPreviousSetOfPages<AnApplication>({ApplicationStage: 0, noOfRecord: this.noOfrecords},this.getApplicantsForSelection);
    Array.isArray(res) ? this.applicantsToBeSelected = res : null;
  }

   statusToShow(applicant: AnApplication): string{
    if (applicant.approverStatus == 'Pending' && applicant.hR_Status == 'Approve') return 'Awaiting';
    if(applicant.approverStatus == 'Awaiting') return 'Awaiting';
    if (applicant.approverStatus == 'Approve' && applicant.hR_Status == 'Approve') return 'Approve';
    if (applicant.hR_Status == 'Rejected' && applicant.approverStatus == 'Pending') return 'Awaiting';
    if (applicant.hR_Status == 'Rejected' && applicant.approverStatus == 'Rejected') return 'Rejected';
    else return 'Pending';
  }
  downloadExcel(){
    this.sharedService.downloadAsExcel(this.applicantsToBeSelected, 'applicants-selected');
  }

  downloadAsPdf(){
    const columns: string[] = ['Serial_Number', 'Applicant_Name', 'Email', 'Age', 'Job_Title', 'Course', 'Date_Applied'];
    const rows =  this.applicantsToBeSelected.map((elem, index) => {
      return [
        index > 8 ? `${index + 1}` : `0${index + 1}`,
        `${elem.firstName} ${elem.middleName} ${elem.lastName}`,
        `${elem.email}`,
        `${elem.age.toString()}`,
        `${elem.jobTitle || elem?.position}`,
        `${elem.courseofStudy}`,
        `${this.sharedService.covertDateToHumanFreiendlyFormat(elem.dateApplied, 'medium')}`
      ]
    })
  var doc =  new jsPDF('landscape', 'mm', [320, 320]);
  const options:UserOptions = {
    head: [columns],
    body: rows,
    headStyles: {
      fillColor: '#F4F7FF',
      textColor: 'black'
    }
  }
  autoTable(doc, options);
  doc.save('applicants_selected.pdf');
  }
  ngOnDestroy(): void {
    this.pagination.clearPaginationStuff();
  }
}



