import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { AnAssessment, AssessmentDetails, AssessmentResponseDS } from 'src/app/models/assessment.models';
import { RequiredQuarterFormat } from 'src/app/models/generalModels';
import { InterviewTypesWithNumber } from 'src/app/models/scheduleModels';
import { AssessmentService } from 'src/app/services/assessment.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { InterviewAssessmentDetailsComponent } from 'src/app/shared/interview-assessment-details/interview-assessment-details.component';

@Component({
  selector: 'app-interview-assessment',
  templateUrl: './interview-assessment.component.html',
  styleUrls: ['./interview-assessment.component.scss']
})
export class InterviewAssessmentComponent implements OnInit {
  isLoading: boolean = true;
  assessments!: AssessmentDetails[];
  quartersToUse: RequiredQuarterFormat[] = [];
  constructor(
     private sdm: SchedulerDateManipulationService,
     private assessmentService: AssessmentService,
     private dialog: MatDialog) { }

  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res); 
    this.getAssessments();
  }

  getAssessments(){
    this.isLoading = true;
    const pObs: PartialObserver<AssessmentResponseDS<AssessmentDetails[]>> = {
      next: ({ data }) => {
        this.isLoading = false;
        this.assessments = data;
        console.log(this.assessments);
        // console.log(this.assessments[1].applicants[0].position)

      },
      error: console.error
    }
    this.assessmentService.getAssesmentsByParameters<AssessmentDetails[]>({ ApplicationStage: InterviewTypesWithNumber.Interview_Invite }).subscribe(pObs)
  }

  showAnInterview(assessment: AssessmentDetails){
    const config: MatDialogConfig = {
      panelClass: 'preview_application',
      width: '84vw',
      maxWidth: '85vw',
      height: '85vh',
      data: assessment
    }
    this.dialog.open(InterviewAssessmentDetailsComponent, config)
  }

  // getAppropriateStatusName(assessment: AssessmentDetails): string{
  //   let returnVal = '';
  //   switch(assessment.scheduleStatus){
  //     case 'Started':
  //     case 'Awaiting ChairPerson':
  //     returnVal = this.getOverallInterviewStatus(assessment);
  //     break;
  //     case 'Completed':
  //     returnVal = 'Completed'
  //     break;
  //     default:
  //     returnVal = 'Not Started'
  //   }
  //   return returnVal;
  // }

  getOverallInterviewStatus(assessment: AssessmentDetails, returnClassNames: boolean): string{
    if(assessment.applicants.every(applicant => applicant.interviewerStatus == 'Completed')) return returnClassNames ? 'Approved': 'Completed'
    if(assessment.applicants.some(applicant => applicant.interviewerStatus == 'Ongoing')) return returnClassNames ? 'Pending' : 'On going'
    return returnClassNames ? 'NotAssessed' : 'Not Started';
   }

 

}
