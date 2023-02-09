import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ASchedule, StageOfCreation } from 'src/app/models/scheduleModels';
import { ScheduleSwitching } from 'src/app/modules/schedule-master/base-schedule-switcher';
// import { InterviewSummaryComponent } from 'src/app/pages/shared/interview-summary/interview-summary.component';

@Component({
  selector: 'app-an-individual-schedule',
  templateUrl: './an-individual-schedule.component.html',
  styleUrls: ['./an-individual-schedule.component.scss']
})
export class AnIndividualScheduleComponent  extends ScheduleSwitching implements OnInit {
  @Input() schedule: ASchedule | undefined
  @Output() sendUpApprovedSchedule = new EventEmitter<Partial<ASchedule>>()
  constructor(public override dialog: MatDialog) { 
    super(dialog);
  }

  ngOnInit(): void {
    // console.log(this.schedule?.dateTime);
  }

  triggerParent(){
  // const d =  super.receiveResponseFromModal();
  // d.afterClosed().subscribe(val => console.log(val))
  }

  displayInterviewDetails(){
    if(this.schedule && this.schedule.hasOwnProperty('status') && this.schedule.status == 'Awaiting'){
      this.schedule.stageOfCreation = StageOfCreation.PendingApproval;
    }
    if(this.schedule && this.schedule.hasOwnProperty('status') && this.schedule.status == 'Approve'){
      this.schedule.stageOfCreation = StageOfCreation.Approved;
    }
    if(this.schedule && this.schedule.hasOwnProperty('status') && this.schedule.status == 'Rejected'){
      this.schedule.stageOfCreation = StageOfCreation.Rejected;
    }
    const config: MatDialogConfig = {
      panelClass: 'interview_summary_comp',
      width: '80vw',
      height: '75vh',
      data: this.schedule
    }
      const d =  super.receiveResponseFromModal(this.schedule!);
      d.afterClosed().subscribe(val =>{
         console.log(val);
        //  debugger;
         if(val){
          (val as ASchedule).stageOfCreation == StageOfCreation.Approved ? 
          (val as ASchedule).stageOfCreation == StageOfCreation.Approved : (val as ASchedule).stageOfCreation == StageOfCreation.Rejected; 
          this.sendUpApprovedSchedule.emit(val)}
        })
  }

  get pending(): boolean{
    return 'status' in this.schedule! && this.schedule?.status == 'Awaiting';
  }

  get approve(): boolean{
    return 'status' in this.schedule! && this.schedule?.status == 'Approve';
  }

  get rejected(): boolean{
    return 'status' in this.schedule! && this.schedule?.status == 'Rejected';
  }

}


