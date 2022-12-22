import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
 roles$!: Observable<any>;
 roleToBeAssigned!: string;
 globusEmail!: string
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

  changeUserRole(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    this.sharedService.loading4button(btn, 'yes', 'Assigning...');
    this.authService.changeUserRole({userName: this.globusEmail, roleName: this.roleToBeAssigned})
    .subscribe(
      val => {
        this.sharedService.successSnackBar('Role changed successfully!!');
        this.sharedService.loading4button(btn, 'done', prevText as string);
      },
      console.error
    )
  }

}
