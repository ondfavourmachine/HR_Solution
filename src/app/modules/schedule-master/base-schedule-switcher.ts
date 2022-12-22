
import { Component } from "@angular/core"
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
import { CreateInviteDS } from "src/app/models/scheduleModels";
import { InterviewSummaryComponent } from "src/app/pages/shared/interview-summary/interview-summary.component";

@Component({
    template: '',
    // selector: 'test-component'
  })
  export abstract class ScheduleSwitching{
    constructor(public dialog: MatDialog){}
     receiveResponseFromModal(createSchedule: Partial<CreateInviteDS>) {
      const config: MatDialogConfig = {
        panelClass: 'interview_summary_comp',
        width: '75vw',
        height: '75vh',
        data: createSchedule
      }
      const dialog =  this.dialog.open(InterviewSummaryComponent, config);
      return dialog;
     }
  }