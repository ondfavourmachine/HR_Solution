import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NecessaryModalMethods } from 'src/app/models/applicant-selection.models';
import { AssessmentDetails } from 'src/app/models/assessment.models';
import {  RequiredApplicantDetails } from 'src/app/models/generalModels';
import { AssessApplicantModalComponent } from '../assess-applicant-modal/assess-applicant-modal.component';

@Component({
  selector: 'app-interview-assessment-details',
  templateUrl: './interview-assessment-details.component.html',
  styleUrls: ['./interview-assessment-details.component.scss']
})
export class InterviewAssessmentDetailsComponent implements OnInit, NecessaryModalMethods {
  isLoading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AssessmentDetails,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    // console.log(this.data.applicants[0].chairPersonInfo);
  }

  closeBtn(){
    this.dialog.closeAll();
  }


 async showOneAssessment(applicant: Partial<RequiredApplicantDetails>){
    try {
       const {applicants, ...rest }= this.data;
       const foundApplicant = applicants.find(elem => elem.applicationRefNo  == applicant.applicationRefNo );
       const componentToShrink = document.querySelector('.preview_application') as HTMLDivElement;
       componentToShrink.classList.add('shrinkUp');
      // applicant = {...applicantData, auditApproval: assessment.auditApproval, assessmentStatus: applicant.assessmentStatus, testScore: applicant.score as any, scoreSheet_URL: applicant.scoreSheet_URL}
      const config: MatDialogConfig = {
        panelClass: 'preview_application',
        width: '85vw',
        maxWidth: '85vw',
        height: '85vh',
        data: {applicantData: foundApplicant, extraInfo: {extras: rest, interviewForm: true, applicantSelectionScreen: true, callBack: ()=> {}}}
      }
      const dialog = this.dialog.open(AssessApplicantModalComponent, config);
      dialog.afterClosed().subscribe({
        next: (val) => {
          componentToShrink.classList.remove('shrinkUp');
          console.log(val)
        },
       })
      } catch (error) {
        console.log(error);
      }
  }
  

}
