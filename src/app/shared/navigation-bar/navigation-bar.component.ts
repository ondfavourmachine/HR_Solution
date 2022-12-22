import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loggedInUser = sessionStorage.getItem('loggedInUser') as string
    this.emailOfLoggedInUser = sessionStorage.getItem('emailOfLoggedInUser') as string;
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  

}
