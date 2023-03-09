import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/sharedServices';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
 @Input('showApplicantNavigation') showApplicantNavigation: boolean = false;
 showLogout: boolean = false;
 emailOfLoggedInUser!: string;
 loggedInUser!: string;
 elongate: boolean = false;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.retrieveItemStoredInCache(environment.cacher.naplózva) as string
    this.emailOfLoggedInUser = this.authService.retrieveItemStoredInCache(environment.cacher.ríomhphostnaplózva) as string;
  }

  async logout(){
    const isExternal = sessionStorage.getItem('isExternal') as string;
    await this.authService.clearSession();
    if(!isExternal) {
      this.router.navigate(['/login']);
      return;
    }
     this.router.navigate(['/signin']);
   }


  toggleHeader(){
    this.elongate = !this.elongate
  }
  

}
