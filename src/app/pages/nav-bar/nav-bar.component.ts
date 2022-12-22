import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
 loggedInUser: string = '';
 roleOfLoggedInUser: string = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loggedInUser = sessionStorage.getItem('loggedInUser') as string;
    this.roleOfLoggedInUser = sessionStorage.getItem('role') as string;

  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
