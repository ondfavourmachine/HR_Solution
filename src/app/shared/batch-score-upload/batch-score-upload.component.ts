import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { BatchedSchedule } from 'src/app/models/assessment.models';
import { mimeTypes } from 'src/app/models/generalModels';
import { TestAssessmentComponent } from 'src/app/modules/assessment/test-assessment/test-assessment.component';
import { AssessmentService } from 'src/app/services/assessment.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-batch-score-upload',
  templateUrl: './batch-score-upload.component.html',
  styleUrls: ['./batch-score-upload.component.scss']
})
export class BatchScoreUploadComponent implements OnInit {
  hasUploadedScore: boolean = false;
  mimeTypesAndTheirPath: Record<mimeTypes, string> = {
    jpg: '../../../assets/images/images.svg',
    png: '../../../assets/images/images.svg',
    jpeg: '../../../assets/images/images.svg',
    doc: '../../../assets/images/word-doc.svg',
    docx: '../../../assets/images/word-doc.svg',
    pdf: '../../../assets/images/pdf_uploaded.svg'
  }
  uploadedMimeType: string = this.mimeTypesAndTheirPath['jpg'];
  file: File | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BatchedSchedule,
    public sharedService: SharedService, private dialog: MatDialog, 
    private matDialogRef: MatDialogRef<TestAssessmentComponent>,
     private assessment: AssessmentService) {
      this.closeAndTriggerParent = this.closeAndTriggerParent.bind(this)
    }

  ngOnInit(): void {
  }

  triggerUpload(){
    document.getElementById('uploadScore')?.click();
  }

  removeUploadedFile(){
    this.file = undefined
    this.hasUploadedScore = false;
  }

  catchSelectedFile(event: Event){
    const files: FileList = (event.target as any).files as FileList
    if(files[0].size > 2 * 1024 * 1024){
      this.sharedService.errorSnackBar('File to be uploaded cannot be more than 2MB')
      return;
    }
    const mimeTypeUploaded = this.mimeTypesAndTheirPath[files[0]?.name.split('.')[1] as mimeTypes];
    this.file = files[0];
    this.uploadedMimeType = mimeTypeUploaded;
    this.hasUploadedScore = true;
  }

  async uploadApplicantTestScore(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    // debugger;
    this.sharedService.loading4button(btn, 'yes', 'Uploading Score sheet....');
      this.assessment.uploadATestScore({SchRef: this.data.scheduleRef as string, scoreSheet: this.file as File})
      .subscribe({
        next: (val) => {
          this.sharedService.loading4button(btn, 'done', prevText as string);
          this.sharedService.triggerSuccessfulInitiationModal('You have successfully Uploaded Score for this Batch', 'Continue', this.closeAndTriggerParent);
        },
        error: (error) => {
          this.sharedService.loading4button(btn, 'done', prevText as string);
          this.sharedService.errorSnackBar('Error occured while trying to grade this applicant');
        }
      })
  }

  closeBtn(){
    this.dialog.closeAll();
  }

  closeAndTriggerParent(){
    this.matDialogRef.close('reload');
  }

}
