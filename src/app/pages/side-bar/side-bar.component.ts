import { Component, OnInit } from '@angular/core';
import { RolesInThisApp } from 'src/app/models/generalModels';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { SharedService } from 'src/app/services/sharedServices';



@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  rolesInThisApp!: RolesInThisApp; 
  constructor(private sharedService: SharedService, public broadCast: BroadCastService) { }

  ngOnInit(): void {
    this.rolesInThisApp = this.sharedService.getRole() as unknown as RolesInThisApp;
  }

}
