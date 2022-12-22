import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { lastValueFrom, PartialObserver } from 'rxjs';
import { AnAssessment, AssessmentResponseDS } from 'src/app/models/assessment.models';
import { AnApplication, ApprovalProcessStatuses, InformationForModal, NYSCStrings, RequiredApplicantDetails, RequiredQuarterFormat } from 'src/app/models/generalModels';
import { InterviewTypesWithNumber } from 'src/app/models/scheduleModels';
import { AssessmentService } from 'src/app/services/assessment.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { AssessApplicantModalComponent } from 'src/app/shared/assess-applicant-modal/assess-applicant-modal.component';

@Component({
  selector: 'app-test-assessment',
  templateUrl: './test-assessment.component.html',
  styleUrls: ['./test-assessment.component.scss']
})
export class TestAssessmentComponent implements OnInit {
 isLoading: boolean = false;
 quartersToUse: RequiredQuarterFormat[] = [];
 data!: InformationForModal<AnApplication & RequiredApplicantDetails>
 assessments: AnAssessment[] = [];
  constructor(private sdm: SchedulerDateManipulationService,
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


  getAssessments(){
    this.isLoading = true;
    const pObs: PartialObserver<AssessmentResponseDS<AnAssessment[]>> = {
      next: ({ data }) => {
        this.isLoading = false;
        this.assessments = data;
      },
      error: console.error
    }
    this.assessmentService.getAssesmentsByParameters<AnAssessment[]>({ ApplicationStage: InterviewTypesWithNumber.Test_Invite }).subscribe(pObs)
  }

  // getAAnAssessment(){}

}
