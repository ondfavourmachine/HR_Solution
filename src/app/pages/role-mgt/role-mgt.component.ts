import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StaffDetailsFromAd } from 'src/app/models/generalModels';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-role-mgt',
  templateUrl: './role-mgt.component.html',
  styleUrls: ['./role-mgt.component.scss']
})
export class RoleMgtComponent implements OnInit {
  roles$!: Observable<any>;
  roleToBeAssigned!: string;
  globusIdentifier!: string
  globusUsername!: string
  searching: boolean = false;
  staffDetail!: StaffDetailsFromAd
   constructor(
     private authService: AuthService,
     private sharedService: SharedService
   ) { }
 
   ngOnInit(): void {
     this.getRoles();
   }
 
   getRoles(){
    this.roles$ = this.authService.getRoles()
   }

   getGlobusStaffDetails(event: Event){
    this.searching = true;
    this.authService.searchForGlobusStaffByUserName((event.target as HTMLInputElement).value)
    .subscribe({
      next: ({result}) => {
        this.searching = false;
        this.staffDetail = result;
        this.globusIdentifier = this.staffDetail.displayName as string;
      },
      error:console.error
    })
   }
 
   changeUserRole(event: Event){
     const btn = event.target as HTMLButtonElement;
     const prevText = btn.textContent;
     this.sharedService.loading4button(btn, 'yes', 'Assigning...');
     this.authService.addStaffToHrSolution({lookUpEmail: this.staffDetail.mail as string, lookUpCode: this.roleToBeAssigned, lookUpName: this.staffDetail.displayName as string})
     .subscribe(
       {
        next: () => {
            this.sharedService.successSnackBar(`${this.staffDetail.displayName} has been added to the HR Solution successfully!`);
            this.sharedService.loading4button(btn, 'done', prevText as string);
        },
        error: (error) => {
          this.sharedService.errorSnackBar(`Failed to add ${this.staffDetail.displayName} to the HR Solution`);
          this.sharedService.loading4button(btn, 'done', prevText as string);
        }
       }
     )
   }

}
