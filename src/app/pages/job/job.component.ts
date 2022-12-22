import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AJob, JobAppliedForByApplicant, otherRelevantData, Views } from 'src/app/models/generalModels';
// import { JobsService } from 'src/app/services/jobs.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  @Input('showPending') showPending: boolean = false;
  @Output('startApproveJob')startApproveJob = new EventEmitter<{view: Views, data: AJob}>();
  @Output('displayJobDetails')displayJobDetails = new EventEmitter<{view: Views, data: AJob}>();
  @Input('APendingJob') APendingJob!: AJob;
  @Input('AnApprovedJob') AnApprovedJob!: AJob;
  @Input('showApplicantJob') showApplicantJob: boolean = false;
  @Input('ApplicantJob') JobAppliedForByApplicant!: JobAppliedForByApplicant;
  @Input('otherRelevantData') otherRelevantData!: otherRelevantData;
  constructor() { }

  ngOnInit(): void {
    
  }

  triggerApprovalProcess(){
    this.startApproveJob.emit({view: 'approve', data: this.APendingJob});
    this.displayJobDetails.emit({view: 'preview', data: this.AnApprovedJob});
  }

 

}
