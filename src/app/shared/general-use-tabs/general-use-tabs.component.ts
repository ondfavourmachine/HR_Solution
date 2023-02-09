import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { tabs } from 'src/app/models/generalModels';

@Component({
  selector: 'app-general-use-tabs',
  templateUrl: './general-use-tabs.component.html',
  styleUrls: ['./general-use-tabs.component.scss'],
  providers: [TitleCasePipe]
})
export class GeneralUseTabsComponent implements OnInit, OnChanges {
  @Output('changeTab') changeTab = new EventEmitter<tabs>();
  @Output() changeRoute = new EventEmitter<tabs>()
  @Input('tabArray') listOfTabs!: tabs[];
  @Input('tabGroupName') tabGroupName!: string
  tabToSelect!: tabs;
  tabToHighlight!: tabs;
  constructor(
    private router: Router,
    private titleCase: TitleCasePipe,
  ) { 
    router.events.subscribe(val => {
      if(val instanceof NavigationEnd) {
        const tabString = val.url.split('/').slice(-1);
        if(!isNaN(parseInt(tabString[0]))) {
          switch(tabString[0]){
            case '02':
              this.tabToHighlight = 'Interview 02';
            break;
            case '03':
              this.tabToHighlight = 'Interview 03';
            break;
          }
        }
        else if(tabString[0] == 'interviews') this.tabToHighlight = 'Interview 01';
        else{
          const tabForm = titleCase.transform(tabString[0]);
          this.tabToHighlight = tabForm as tabs;
        }
      }
    });
  }

  ngOnChanges() {
   this.tabToSelect = this.tabToHighlight || this.listOfTabs[0];
  }

  ngOnInit(): void {
  }


  changeTabs(tab: tabs){
    this.tabToSelect = tab;
    this.changeTab.emit(tab);
    this.changeRoute.emit(tab);
  }
}
