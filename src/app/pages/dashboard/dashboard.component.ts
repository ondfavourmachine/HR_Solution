import { Component, OnInit } from '@angular/core';
import { BroadCastService } from 'src/app/services/broad-cast.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  reduceSideBar: boolean = false;
  constructor(public broadCast: BroadCastService) {}

  ngOnInit(): void {
    
  }

  toggleBigSideBar(){
    this.reduceSideBar = !this.reduceSideBar;
    this.broadCast.broadCastToggleForSideBar(this.reduceSideBar);
  }


}
