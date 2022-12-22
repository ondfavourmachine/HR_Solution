import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-reusable-search',
  templateUrl: './reusable-search.component.html',
  styleUrls: ['./reusable-search.component.scss']
})
export class ReusableSearchComponent implements OnInit {
  globusBankBranchLocations$!: Observable<any>
  constructor(public sharedService: SharedService) { }

  ngOnInit(): void {
    this.getLocations();
  }


  getLocations(){
    this.globusBankBranchLocations$ = this.sharedService.getBranchesInGlobus();
  }
}
