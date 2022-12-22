import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InformationForApprovalModal, PreviewActions } from 'src/app/models/generalModels';
// import { ApplicantSelectionComponent } from 'src/app/pages/applicant-selection/applicant-selection.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';

@Component({
  selector: 'app-approval-modal',
  templateUrl: './approval-modal.component.html',
  styleUrls: ['./approval-modal.component.scss']
})
export class ApprovalModalComponent implements OnInit {
  comment: string = ''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformationForApprovalModal<string, string, Function>,
    private dailog: MatDialogRef<DashboardComponent>) { }

  ngOnInit(): void {
    console.log(this.data);
  }


  close(str?: string){
    this.dailog.close(str);
    if(this.data.callBack && typeof this.data.callBack == 'function') this.data.callBack(PreviewActions.CLOSEANDSUBMIT, this.comment);
  }
}
