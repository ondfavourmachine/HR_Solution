import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { InformationForApprovalModal } from 'src/app/models/generalModels';

@Component({
  selector: 'app-successful-initiation',
  templateUrl: './successful-initiation.component.html',
  styleUrls: ['./successful-initiation.component.scss']
})
export class SuccessfulInitiationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InformationForApprovalModal<string, string, Function>,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialog.closeAll();
    if(this.data.callBack) this.data.callBack();
  }

}
