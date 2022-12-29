import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { NecessaryModalMethods } from 'src/app/models/applicant-selection.models';
import { InformationForApprovingAnAssessment } from 'src/app/models/assessment.models';
import { ASchedule, InterviewTypesWithNumber, ScheduleApprovalNum, StageOfCreation } from 'src/app/models/scheduleModels';
import { ScheduleSwitching } from 'src/app/modules/schedule-master/base-schedule-switcher';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SharedService } from 'src/app/services/sharedServices';
// import { AnIndividualScheduleComponent } from 'src/app/shared/an-individual-schedule/an-individual-schedule.component';
import { InterviewApprovalComponent } from 'src/app/shared/interview-approval/interview-approval.component';

@Component({
  selector: 'app-interview-summary',
  templateUrl: './interview-summary.component.html',
  styleUrls: ['./interview-summary.component.scss'],
  providers: [DatePipe]
})
export class InterviewSummaryComponent implements OnInit, NecessaryModalMethods {
role!: string
appropriateDateTimeToDisplay!:string
  constructor(
       @Inject(MAT_DIALOG_DATA) public data: Partial<ASchedule>,  
       private scheduleService: ScheduleService,
       private sharedService: SharedService,
       private datePipe: DatePipe,
       private dialog:MatDialog,
       private dialogRef: MatDialogRef<ScheduleSwitching>) { }

  ngOnInit(): void {
    console.log(this.data);
    this.modifyDateForDisplay();
    this.role = this.sharedService.getRole();
  }

  closeBtn(){
    this.dialogRef.close();
  }

  modifyDateForDisplay(){
    if(this.data.stageOfCreation == StageOfCreation.Initiation){
      const [time, year, month, day] = (this.data.schduleDateFormatForDisplay as string)?.split('--');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      this.appropriateDateTimeToDisplay = `${this.datePipe.transform(date, 'MMMM d, y')}, at ${time} hrs`
    }else{
      const [dateTime, time] = (this.data.dateTime as string)?.split('T');
      const [year, month, day] = dateTime.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      this.appropriateDateTimeToDisplay = `${this.datePipe.transform(date, 'MMMM d, y')}, at ${time.slice(0, 5)} hrs`
    }
    
  }

  createThisSchedule(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent as string;
    let schedule: Partial<ASchedule> = {};
    const {branchId, applicants, dateTime, interviewChairPerson, testTime, testInvigilators, interviewers, description, departmentId, inviteType} = this.data;
    schedule = {branchId, applicants: applicants?.map(elem => ({email: elem.email, applicatiionRef: elem.applicatiionRef})), 
      dateTime, description, testTime, testInvigilators, interviewers, interviewChairPerson, departmentId, inviteType: !inviteType ? 6 : inviteType // lazy way of setting offer letter type. Will refactor later
      };
    'hospitalName' in this.data && this.data.hospitalName!.length > 2 ? schedule = {...schedule, hospitalName: this.data.hospitalName} : null;
    // debugger;
    this.sharedService.loading4button(btn, 'yes', 'Creating Schedule...');
    this.scheduleService.createSchedule(schedule)
    .subscribe({
      next: (val) => {
        if(!val.hasError && val.statusCode == 200) {
          this.sharedService.loading4button(btn, 'done', prevText);
          this.dialogRef.close(this.data);
        }
      },
      error: (err) => {
        console.log(err);
        this.sharedService.loading4button(btn, 'done', prevText);
        this.sharedService.errorSnackBar('An error occured while creating schedule. Please try again later!')
      }
    })
  }

   AppropriateTextForButton(inviteType: number): string{
    let returnVal;
    switch(inviteType) {
      case 1:
        returnVal = 'Approve Test Invite'
      break;
      case 2:
      case 3:
      case 4:
      returnVal = 'Approve Interview Invite'
      break;
      case 5:
      returnVal = 'Approve Medical Invite'
      break;
      
    }

    return returnVal as string;
  }

  triggerApprovalProcess(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent as string;
    const currentlyOpenElement =  document.querySelector('.interview_summary_comp');
    currentlyOpenElement?.classList.add('shrinkUp'); 
    const data: InformationForApprovingAnAssessment = 
    {
      buttonText: this.AppropriateTextForButton(this.data.inviteType as InterviewTypesWithNumber), 
      headingText: this.AppropriateTextForButton(this.data.inviteType as InterviewTypesWithNumber), 
      typeOfAssessment: this.data.inviteType as InterviewTypesWithNumber
    }
    const config: MatDialogConfig = {
      width: '42vw',
      height: '48vh',
      panelClass: 'InviteApproval', 
      data   
    }
    this.dialog.open(InterviewApprovalComponent, config)
    .afterClosed().subscribe(
      async (val) => {
        currentlyOpenElement?.classList.remove('shrinkUp');
        if(val && val.length > 2){
          this.sharedService.loading4button(btn, 'yes', 'Approving...');
          try {
            // debugger;
            const res = await lastValueFrom(this.scheduleService.approveSchedule({scheduleId: this.data.id as number, scheduleRef: this.data.scheduleId as string, actionType: 1, status: ScheduleApprovalNum.Approving, comment: val}));
            if(!res.hasError && (res.statusCode == '200' || res.statusCode == 200)){
              this.data.stageOfCreation == StageOfCreation.Approved
              this.sharedService.loading4button(btn, 'done', prevText);
              this.dialogRef.close(this.data);
              return;
            }
            throw new Error('Unable to approve this schedule');
          } catch (error) {
            console.log(error);
            this.sharedService.loading4button(btn, 'done', prevText);
            this.sharedService.errorSnackBar(typeof error == 'string' ? error : 'Failed to approve this schedule');
          }
        }
        
      }
    )
    
  }

  displayAppropriateString(getPosition: boolean, str?: string): string{
    // console.log(str);
    if(str && str.split('/').length > 0){
      // console.log(str);
      return !getPosition ? str.split('/')[1] : str.split('/')[2];
    }
    // console.log(str);
    return str as string;
  }

  getHeading(inviteType?: number): string | undefined{
    let returnVal;
    switch(inviteType){
      case 1:
        returnVal = 'Test Invite Summary';
      break;
      case 2:
      case 3:
      case 4:
        returnVal = 'Interview Invite Summary';
      break;
      case 5:
        returnVal = 'Medical Invite Summary';
      break;
      case 6:
        returnVal = 'Offer Letter Invite Summary';
      break;
    }
    return returnVal;
  }

}
