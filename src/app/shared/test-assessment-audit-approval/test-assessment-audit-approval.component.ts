import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NecessaryModalMethods } from 'src/app/models/applicant-selection.models';
import { ApplicationApprovalStatus } from 'src/app/models/generalModels';
import { TestAssessmentComponent } from 'src/app/modules/assessment/test-assessment/test-assessment.component';

@Component({
  selector: 'app-test-assessment-audit-approval',
  templateUrl: './test-assessment-audit-approval.component.html',
  styleUrls: ['./test-assessment-audit-approval.component.scss']
})
export class TestAssessmentAuditApprovalComponent implements OnInit, NecessaryModalMethods {
  comment!: string;
  constructor(
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<TestAssessmentComponent>
  ) { }
  

  ngOnInit(): void {
  }

  closeBtn(){
    this.dialog.closeAll();
  }

  closeAndTriggerParent(typeOfAction: ApplicationApprovalStatus){
    this.matDialogRef.close({comment: this.comment, actionType: typeOfAction});
  }

 

}
