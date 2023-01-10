import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { lastValueFrom, PartialObserver } from 'rxjs';
import { AnAssessment, AssessmentResponseDS } from 'src/app/models/assessment.models';
import { AnApplication, InformationForModal, PaginationMethodsForSelectionAndAssessments, RequiredApplicantDetails, RequiredQuarterFormat } from 'src/app/models/generalModels';
import { InterviewTypesWithNumber } from 'src/app/models/scheduleModels';
import { AssessmentService } from 'src/app/services/assessment.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { AssessApplicantModalComponent } from 'src/app/shared/assess-applicant-modal/assess-applicant-modal.component';

@Component({
  selector: 'app-test-assessment',
  templateUrl: './test-assessment.component.html',
  styleUrls: ['./test-assessment.component.scss']
})
export class TestAssessmentComponent implements OnInit, PaginationMethodsForSelectionAndAssessments {
 isLoading: boolean = false;
 quartersToUse: RequiredQuarterFormat[] = [];
 data!: InformationForModal<AnApplication & RequiredApplicantDetails>
 assessments: AnAssessment[] = [];
 noOfRecords: number = 0;
 useCurrentPage: boolean = false;
  constructor(private sdm: SchedulerDateManipulationService,
    private pagination: PaginationService,
    private dialog: MatDialog, private assessmentService: AssessmentService ) 
    { 
      this.getAssessments = this.getAssessments.bind(this)
    }
 

  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
    this.getAssessments();
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


  getAssessments( applicationStage?: InterviewTypesWithNumber, pageNumber?: number, noOfRecord?: number){
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
      },
      error: console.error
    }
    this.assessmentService.getAssesmentsByParameters<AnAssessment[]>({ ApplicationStage: InterviewTypesWithNumber.Test_Invite, PageNumber: pageNumber ? pageNumber.toString() : this.useCurrentPage ? this.pagination.currentPage.toString() : '1', PageSize: noOfRecord ? noOfRecord.toString() : '10'}).subscribe(pObs)
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

}
