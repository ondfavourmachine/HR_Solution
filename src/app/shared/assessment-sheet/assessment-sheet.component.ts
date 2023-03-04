import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FullInterviewerDetailsAndInterviewResponse, NecessaryModalMethods } from 'src/app/models/applicant-selection.models';
import { AnApplication, ApprovalProcessStatuses, InformationForModal, PreviewActions } from 'src/app/models/generalModels';
import { PreviewApplicationComponent } from 'src/app/pages/preview-application/preview-application.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-assessment-sheet',
  templateUrl: './assessment-sheet.component.html',
  styleUrls: ['./assessment-sheet.component.scss']
})
export class AssessmentSheetComponent implements OnInit, NecessaryModalMethods {
  role!: string;
  // email!: string;
  answers = {
    authenticity: 'authenticity_input_0',
    intergrity: 'intergrity_input_0',
    focus: 'focus_input_0',
    drive: 'drive_input_0',
    intelligence: 'intelligence_input_0',
    communication: 'communication_input_0',
    competence: 'competence_input_0',
    experience: 'experience_input_0',
    performanceTrackRecord: 'performanceTrackRecord_input_0',
    interPersonalSkill: 'interPersonalSkill_input_0',
    leadershipSkill: 'leadershipSkill_input_0',
    jobFit: 'jobFit_input_0',
    totalScore: '0'
  }
  // loggedInUserHasntGradedApplicant: boolean = false;
  recommendation!: ApprovalProcessStatuses
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformationForModal<AnApplication>,
    private matDialogRef: MatDialogRef<PreviewApplicationComponent>,
    private authService: AuthService,
    // private sharedService: SharedService,
  ) { }

  closeBtn(): void {
    this.matDialogRef.close(PreviewActions.CLOSEANDDONOTHING);
  }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    console.log(this.data.applicantData.interviewersSummary);
    this.getGradesByLoggedInUser();
  }

 async getGradesByLoggedInUser(){
  const extras = this.data.extraInfo?.extras;
   for(let key in this.answers){
    const newValue = (extras as Partial<FullInterviewerDetailsAndInterviewResponse>)[key as keyof Partial<FullInterviewerDetailsAndInterviewResponse>];
    (this.answers as any)[key] = `${key}_input_${newValue}`;
     }
     this.answers.totalScore = (extras as Partial<FullInterviewerDetailsAndInterviewResponse>)!.totalScore!.toString() + '%';
     this.recommendation =(extras as Partial<FullInterviewerDetailsAndInterviewResponse>).recommendation as ApprovalProcessStatuses;
  
  }

}
