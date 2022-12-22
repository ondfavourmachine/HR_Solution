import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InformationForApprovingAnAssessment } from 'src/app/models/assessment.models';
import { InterviewTypesWithNumber } from 'src/app/models/scheduleModels';
import { InterviewSummaryComponent } from 'src/app/pages/shared/interview-summary/interview-summary.component';
import { AssessApplicantModalComponent } from '../assess-applicant-modal/assess-applicant-modal.component';

@Component({
  selector: 'app-interview-approval',
  templateUrl: './interview-approval.component.html',
  styleUrls: ['./interview-approval.component.scss']
})
export class InterviewApprovalComponent implements OnInit {
   comment!: string;
   // another way to have multiple components receive feedback notifications from a material modal
   // by having multiple dialogRefs for different parent components
   // this method is much more verbose and less clean in my opinion
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformationForApprovingAnAssessment,  
    private dialogRef1: MatDialogRef<InterviewSummaryComponent>, 
    private dialogRef2: MatDialogRef<AssessApplicantModalComponent>) { }

  ngOnInit(): void {
  }

  close(response?: string){
    switch(this.data.typeOfAssessment){
      case InterviewTypesWithNumber.Test_Invite:
        response ? this.dialogRef2.close(response) : this.dialogRef2.close();
        break;
      default:
      response ? this.dialogRef1.close(response) : this.dialogRef1.close();
    }
   
  }

}
