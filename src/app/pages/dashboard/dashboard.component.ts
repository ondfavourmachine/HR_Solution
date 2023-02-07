import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  reduceSideBar: boolean = false;
  constructor() {
    
   }

  ngOnInit(): void {
    
  }

  toggleBigSideBar(){
    this.reduceSideBar = !this.reduceSideBar;
  }


}
