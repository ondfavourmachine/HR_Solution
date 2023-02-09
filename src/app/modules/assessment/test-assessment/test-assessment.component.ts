import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { id } from 'date-fns/locale';
import { lastValueFrom, PartialObserver, Subscription } from 'rxjs';
import { AnAssessment, AssessmentResponseDS, BatchedSchedule } from 'src/app/models/assessment.models';
import { AnApplication, ApplicationApprovalStatus, ApprovalProcessStatuses, InformationForModal, PaginationMethodsForSelectionAndAssessments, RequiredApplicantDetails, RequiredQuarterFormat } from 'src/app/models/generalModels';
import { InterviewTypesWithNumber } from 'src/app/models/scheduleModels';
import { AssessmentService } from 'src/app/services/assessment.service';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';
import { AssessApplicantModalComponent } from 'src/app/shared/assess-applicant-modal/assess-applicant-modal.component';
import { BatchScoreUploadComponent } from 'src/app/shared/batch-score-upload/batch-score-upload.component';
import { TestAssessmentAuditApprovalComponent } from 'src/app/shared/test-assessment-audit-approval/test-assessment-audit-approval.component';

@Component({
  selector: 'app-test-assessment',
  templateUrl: './test-assessment.component.html',
  styleUrls: ['./test-assessment.component.scss']
})
export class TestAssessmentComponent implements OnInit, PaginationMethodsForSelectionAndAssessments, OnDestroy {
 isLoading: boolean = false;
 quartersToUse: RequiredQuarterFormat[] = [];
 data!: InformationForModal<AnApplication & RequiredApplicantDetails>
 assessments: AnAssessment[] = [];
 noOfRecords: number = 0;
 useCurrentPage: boolean = false;
 view: 'Batch View' | 'Single View' = 'Batch View';
 current: number = 0;
 showDropDown: boolean = false;
 testBatches: BatchedSchedule[] = [];
 currentBatchInView!: BatchedSchedule;
 destroyObs!: Subscription;
 stopLoading: {stopLoading: boolean} = {stopLoading : false};
  constructor(private sdm: SchedulerDateManipulationService,
    private pagination: PaginationService,
    private schedule: ScheduleService,
    private broadCastService: BroadCastService,
    private sharedService: SharedService,
    private dialog: MatDialog, private assessmentService: AssessmentService ) 
    { 
      this.getAssessments = this.getAssessments.bind(this);
      this.fetchASingleBatchOfTestApplicants = this.fetchASingleBatchOfTestApplicants.bind(this);
      this.getTestBatches = this.getTestBatches.bind(this);
    }
 

  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
    this.getAssessments();
    this.getTestBatches();
    this.destroyObs = this.broadCastService.changeInViewSubject$.subscribe(
      {next: val => val == null ? null : this.view = val}
    )
  }

  // get FunctionToUse(): Function{
  //   let functionToUse: Function;
  //   this.view == 'Batch View' ? functionToUse = this.getTestBatches : functionToUse = 
  // }

  toggleDropDown(index: number){
    this.current = index
    this.showDropDown = !this.showDropDown;
  }

  async getAAnAssessment(applicant: AnAssessment){
    try {
    const {result} = await lastValueFrom(this.assessmentService.getOneAssessment(applicant.scheduleId, applicant.applicationRefNo));
    const { applicants, ...rest} = result;
    let applicantData : Partial<AnApplication> = applicants[0];
    applicantData = {...applicantData, auditApproval: applicant.auditApproval, assessmentStatus: applicant.assessmentStatus, testScore: applicant.score as any, scoreSheet_URL: applicant.scoreSheet_URL}
    const config: MatDialogConfig = {
      panelClass: 'preview_application',
      width: '85vw',
      maxWidth: '85vw',
      height: '85vh',
      data: {applicantData, extraInfo: {extras: rest, interviewForm: false, applicantSelectionScreen: true, callBack: this.getAssessments}}
    }
    const dialog = this.dialog.open(AssessApplicantModalComponent, config);
    } catch (error) {
      console.log(error);
    }
}

getTestApplicants(event: Event, batch: BatchedSchedule){}

fetchASingleBatchOfTestApplicants(batch: BatchedSchedule, event?: Event, pageNumber?: number, noOfRecord?: number){
  let li!: HTMLLIElement;
  if(event){
  li = event?.target as HTMLLIElement;
  const contents = li.innerHTML;
  li.childNodes[1].textContent = 'Loading...';
  }
  this.currentBatchInView = batch;
  const pObs: PartialObserver<AssessmentResponseDS<AnAssessment[]>> = {
    next: ({ data, totalRecords, pageSize }) => {
      this.pagination.paginationData.size > 0 && this.pagination.paginationData.get(1)!.length > 0 ? this.pagination.updatePaginationData = true : this.pagination.updatePaginationData = false;
      this.pagination.calculatePagination<AnAssessment>(data, totalRecords);
      this.pagination.generatePagesForView();
      this.noOfRecords = pageSize;
      this.assessments = this.pagination.getAPageOfPaginatedData<AnAssessment>();
      this.isLoading = false;
      this.assessments = data;
      this.useCurrentPage = false;
      event ? li.childNodes[1].textContent = 'View Applicants': null;
      this.view = 'Single View';
      this.toggleDropDown(0);
      this.broadCastService.notifyParentComponentOfChangeInView(this.view);
    },
    error: console.error
  }
  this.assessmentService.fetchASingleBatch<AnAssessment[]>({scheduleRef:this.currentBatchInView.scheduleRef, ApplicationStage: 1, PageNumber: pageNumber ? pageNumber.toString() : this.useCurrentPage ? this.pagination.currentPage.toString() : '1', PageSize: noOfRecord ? noOfRecord.toString() : '10'}).subscribe(pObs);
}


  getAssessments(applicationStage?: InterviewTypesWithNumber, pageNumber?: number, noOfRecord?: number){
    this.isLoading = true;
    const pObs: PartialObserver<AssessmentResponseDS<AnAssessment[]>> = {
      next: ({ data, totalRecords, pageSize }) => {
        this.pagination.paginationData.size > 0 && this.pagination.paginationData.get(1)!.length > 0 ? this.pagination.updatePaginationData = true : this.pagination.updatePaginationData = false;
        this.pagination.calculatePagination<AnAssessment>(data, totalRecords);
        this.pagination.generatePagesForView();
        this.isLoading = false;
        this.noOfRecords = pageSize;
        this.assessments = this.pagination.getAPageOfPaginatedData<AnAssessment>();
        this.isLoading = false;
        this.assessments = data;
        this.useCurrentPage = false;
        this.stopLoading = {stopLoading: false};
      },
      error: console.error
    }
    this.assessmentService.getAssesmentsByParameters<AnAssessment[]>({ ApplicationStage: InterviewTypesWithNumber.Test_Invite, PageNumber: pageNumber ? pageNumber.toString() : this.useCurrentPage ? this.pagination.currentPage.toString() : '1', PageSize: noOfRecord ? noOfRecord.toString() : '10'}).subscribe(pObs)
  }
  triggerUploadScoreComp(batch: BatchedSchedule){
    const config: MatDialogConfig = {
      width: '42vw',
      minHeight: '30vh',
      panelClass: 'BatchUploadComp',   
      data: batch
    }
   const dialog = this.dialog.open(BatchScoreUploadComponent, config);
   dialog.afterClosed().subscribe(
    val => {
      if(typeof val == 'string')
      this.getTestBatches(1, 1, 10);
      // this.fetchASingleBatchOfTestApplicants(batch, undefined, 1, 10);
      
    },
   )
  }

  triggerAuditApprovalComponent(batch: BatchedSchedule){
    if(this.sharedService.getRole() == ('HRAdmin' || 'Approver')) {
      this.sharedService.errorSnackBar('Only user with audit role is allowed to approve');
      return;
    }
    const config: MatDialogConfig = {
      width: '42vw',
      minHeight: '35vh',
      panelClass: 'BatchUploadComp',   
      data: batch
    }
   const dialog = this.dialog.open(TestAssessmentAuditApprovalComponent, config);
   dialog.afterClosed().subscribe(
    async val => {
      if(typeof val == 'string'){
        this.getTestBatches(1, 1, 10);
      }
      if(typeof val == 'object'){
        try {
          const t = val as {comment: string, actionType: ApplicationApprovalStatus};
          const res  = await lastValueFrom(this.schedule.approveSchedule({scheduleId: 0, scheduleRef: batch.scheduleRef, actionType: 1, status: t.actionType, comment: t.comment}));
          if(!res.hasError && res.statusCode == '200'){
            this.sharedService.triggerSuccessfulInitiationModal(`You have successfully ${t.actionType == ApplicationApprovalStatus.Approve ? 'approved' : 'rejected'} the scores for this batch`, 'Continue to Test Assessment', this.getTestBatches);
          }   
        } catch (error) {
          console.log(error);
        }
      }
      // this.fetchASingleBatchOfTestApplicants(batch, undefined, 1, 10);
      
    },
   )
  }

  getTestBatches(applicationStage?: InterviewTypesWithNumber, pageNumber?: number, noOfRecord?: number){
    this.isLoading = true;
    const pObs: PartialObserver<AssessmentResponseDS<BatchedSchedule[]>> = {
      next: (val) => {
        // just call clearPaginationData when switching pages;

        // this.pagination.paginationData.size > 0 && this.pagination.paginationData.get(1)!.length > 0 ? this.pagination.updatePaginationData = true : this.pagination.updatePaginationData = false;
        // this.pagination.calculatePagination<AnAssessment>(data, totalRecords);
        // this.pagination.generatePagesForView();
        // this.isLoading = false;
        // this.noOfRecords = pageSize;
        // this.assessments = this.pagination.getAPageOfPaginatedData<AnAssessment>();
        this.isLoading = false;
        // this.assessments = data;
        // this.useCurrentPage = false;
        console.log(val.data);
        this.stopLoading = {stopLoading: false};
        this.testBatches = val.data;
        this.current = 0;
        this.showDropDown = false;
      },
      error: console.error
    }
    this.assessmentService.getAllTestBatches<BatchedSchedule[]>({ ApplicationStage: InterviewTypesWithNumber.Test_Invite, PageNumber: pageNumber ? pageNumber.toString() : this.useCurrentPage ? this.pagination.currentPage.toString() : '1', PageSize: noOfRecord ? noOfRecord.toString() : '10'}).subscribe(pObs)
  }

  loadNextSetOfPages() {
    const res = this.pagination.loadNextSetOfPages<AnAssessment>({ApplicationStage: 1, noOfRecord: this.noOfRecords}, this.getAssessments);
    Array.isArray(res) ? this.assessments = res : null;
  }
  loadPreviousSetOfPages(){
    const res = this.pagination.loadPreviousSetOfPages<AnAssessment>({ApplicationStage: 1, noOfRecord: this.noOfRecords},this.getAssessments);
    Array.isArray(res) ? this.assessments = res : null;
  }
  fetchRequiredNoOfRecords(): void {
    this.pagination.pageLimit = this.noOfRecords;
    this.getAssessments(this.pagination.currentPage, this.noOfRecords);
  }
  selectAPageAndInformation(pageNumber: number): void {
    if(this.pagination.paginationData.get(pageNumber)!.length > 0){
      this.pagination.currentPage = pageNumber;
      this.assessments = this.pagination.getAPageOfPaginatedData<AnAssessment>(pageNumber);
      return;
    }
    this.pagination.currentPage = pageNumber;
    this.getAssessments(1,pageNumber);
  }

  ngOnDestroy(): void {
    this.destroyObs ? this.destroyObs.unsubscribe() : null;
  }

}
