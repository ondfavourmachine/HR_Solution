import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NavBarComponent } from 'src/app/pages/nav-bar/nav-bar.component';

@Component({
  selector: 'app-idle-prompt-component',
  templateUrl: './idle-prompt-component.component.html',
  styleUrls: ['./idle-prompt-component.component.scss']
})
export class IdlePromptComponentComponent {
  constructor(private dialogRef: MatDialogRef<NavBarComponent>){}

  stay(){
    this.dialogRef.close('stay')
  }

  logout(){
    this.dialogRef.close('logout');
  }
}
