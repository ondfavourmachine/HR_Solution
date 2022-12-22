import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestDetails } from 'src/app/models/generalModels';

@Component({
  selector: 'app-test-invite-description-view',
  templateUrl: './test-invite-description-view.component.html',
  styleUrls: ['./test-invite-description-view.component.scss']
})
export class TestInviteDescriptionViewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: TestDetails,private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  close(){
    this.dialog.closeAll()
  }

}
