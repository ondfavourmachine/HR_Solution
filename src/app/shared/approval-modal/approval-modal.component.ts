import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SpecialCandidate } from 'src/app/models/applicant-selection.models';
import { InformationForApprovalModal, PreviewActions } from 'src/app/models/generalModels';
// import { ApplicantSelectionComponent } from 'src/app/pages/applicant-selection/applicant-selection.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval-modal',
  templateUrl: './approval-modal.component.html',
  styleUrls: ['./approval-modal.component.scss']
})
export class ApprovalModalComponent implements OnInit {
  comment: string = '';
  isSpecialCandidate: boolean = false;
  stageSelector: string = '';
  roleOfLoggedInUser!: string
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformationForApprovalModal<string, string, Function>,
    private dailog: MatDialogRef<DashboardComponent>, private authService:AuthService) { }

  ngOnInit(): void {
    console.log(this.data);
    this.roleOfLoggedInUser = this.authService.retrieveItemStoredInCache(environment.cacher.ruolo) as string;
  }


  close(str?: string){
    this.dailog.close(this.isSpecialCandidate ? new SpecialCandidate(str as string, this.isSpecialCandidate,this.stageSelector) : str);
    if(this.data.callBack && typeof this.data.callBack == 'function') this.data.callBack(PreviewActions.CLOSEANDSUBMIT, this.comment);
  }

  toggleSpecialCandidate(event: MatSlideToggleChange){
    this.isSpecialCandidate = event.checked;
    !this.isSpecialCandidate ? this.stageSelector = '' : null;
    console.log(this.stageSelector );
  }

 get disableButtonWhenNoStageForSpecialCandidateHasBeenSelected(): boolean{
    return this.stageSelector  == '' && this.isSpecialCandidate;
  }
}
