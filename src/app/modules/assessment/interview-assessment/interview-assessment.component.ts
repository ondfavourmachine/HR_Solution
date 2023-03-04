import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { AssessmentDetails, AssessmentResponseDS } from 'src/app/models/assessment.models';
import { RequiredQuarterFormat, SearchParams } from 'src/app/models/generalModels';
import { InterviewTypesWithNumber } from 'src/app/models/scheduleModels';
import { AssessmentService } from 'src/app/services/assessment.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';
import { InterviewAssessmentDetailsComponent } from 'src/app/shared/interview-assessment-details/interview-assessment-details.component';
import {  jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import {UserOptions} from 'jspdf-autotable';
import { Subscription } from 'rxjs';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { PaginationService } from 'src/app/services/pagination.service';

@Component({
  selector: 'app-interview-assessment',
  templateUrl: './interview-assessment.component.html',
  styleUrls: ['./interview-assessment.component.scss']
})
export class InterviewAssessmentComponent implements OnInit {
  isLoading: boolean = true;
  assessments!: AssessmentDetails[];
  quartersToUse: RequiredQuarterFormat[] = [];
  stopLoading: {stopLoading: boolean} = {stopLoading : false};
  hideSearch: boolean=true;
  destroyObs: Subscription[] = [];
  useCurrentPage: boolean = false;
  noOfRecords: number = 10;
  constructor(
     private sdm: SchedulerDateManipulationService,
     private assessmentService: AssessmentService,
     private sharedService:SharedService,
     private pagination: PaginationService,
     private broadCast: BroadCastService,
     private dialog: MatDialog) {
      this.getAssessments = this.getAssessments.bind(this);
      }

  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
    this.getAssessments();

    this.destroyObs[1] = this.broadCast.search$.subscribe(val =>{
      if(val != null && typeof val == 'object'){
        this.isLoading = true;
        this.getAssessments(InterviewTypesWithNumber.Test_Invite, this.pagination.currentPage, this.noOfRecords, val);
      }
      else if(val == 'reload'){
        this.useCurrentPage = true;
        this.getAssessments();
      } 
    })
  }

  getAssessments(applicationStage?: InterviewTypesWithNumber, pageNumber?: number, noOfRecord?: number, SearchParams?: Partial<SearchParams>){
    this.isLoading = true;
    const pObs: PartialObserver<AssessmentResponseDS<AssessmentDetails[]>> = {
      next: ({ data }) => {
        this.isLoading = false;
        this.assessments = data;
        this.stopLoading = {stopLoading: false};
      },
      error: console.error
    }
    this.assessmentService.getAssesmentsByParameters<AssessmentDetails[]>({ ApplicationStage: InterviewTypesWithNumber.Interview_Invite, PageNumber: pageNumber ? pageNumber.toString() : this.useCurrentPage ? this.pagination.currentPage.toString() : '1', PageSize: noOfRecord ? noOfRecord.toString() : '10', ...SearchParams}).subscribe(pObs)
  }

  

  showAnInterview(assessment: AssessmentDetails){
    const config: MatDialogConfig = {
      panelClass: 'preview_application',
      width: '84vw',
      maxWidth: '85vw',
      height: '85vh',
      data: {...assessment, callBack: this.getAssessments}
    }
    this.dialog.open(InterviewAssessmentDetailsComponent, config)
  }

  getOverallInterviewStatus(assessment: AssessmentDetails, returnClassNames: boolean): string{
    if(assessment.applicants.every(applicant => applicant.interviewerStatus == 'Completed')) return returnClassNames ? 'Approved': 'Completed'
    if(assessment.applicants.some(applicant => applicant.interviewerStatus == 'Ongoing')) return returnClassNames ? 'Pending' : 'On going'
    return returnClassNames ? 'NotAssessed' : 'Not Started';
   }

   downloadExcel(){
    this.sharedService.downloadAsExcel(this.assessments, 'applicants-selected');
  }


   downloadAsPdf(){
    const columns: string[] = ['Serial_Number', 'Job_Title', 'Department', 'Date_Time', 'Applicants', 'Interviewers'];
    const rows =  this.assessments.map((elem, index) => {
      return [
        index > 8 ? `${index + 1}` : `0${index + 1}`,
        `${elem.jobTitle}`,
        `${elem.departmentName}`,
        `${this.sharedService.covertDateToHumanFreiendlyFormat(elem.dateTime, 'medium')}`,
        `${elem.applicants}`,
        `${elem.interviewers!.length}`,
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
      this.destroyObs ? this.destroyObs.forEach(elem => elem.unsubscribe()) : null;
      this.broadCast.broadCastSearchInformation(null);
      this.pagination.clearPaginationStuff();
    }
}
