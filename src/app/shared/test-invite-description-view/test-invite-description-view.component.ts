import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApprovalProcessStatuses, TestDetails } from 'src/app/models/generalModels';
import { ExternalApplicantService } from 'src/app/services/external-applicant.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-test-invite-description-view',
  templateUrl: './test-invite-description-view.component.html',
  styleUrls: ['./test-invite-description-view.component.scss']
})
export class TestInviteDescriptionViewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: TestDetails & {  isOfferLetterInformation: boolean, stage?: number, applicantRefNo: string },
  private externalService: ExternalApplicantService, private sharedService: SharedService,
  private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  close(){
    this.dialog.closeAll()
  }

  acceptOrRejectOffer(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent as string;
    this.sharedService.loading4button(btn, 'yes', 'Accepting...');
    this.externalService.candidateAcceptanceOrRejection({applicationRef: this.data.applicantRefNo, status: ApprovalProcessStatuses.Approve, createdBy: ''})
    .subscribe({
      next: (val) => {
        this.sharedService.loading4button(btn, 'done', prevText as string);
        this.sharedService.successSnackBar('Your decision has been submitted successfully.')
      },
      error: (err) => {
        console.log(err);
        this.sharedService.errorSnackBar('Failed to submit your decision!');
        this.sharedService.loading4button(btn, 'done', prevText as string);
      }
    })
  }

}
