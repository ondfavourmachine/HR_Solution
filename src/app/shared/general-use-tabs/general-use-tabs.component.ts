import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { tabs } from 'src/app/models/generalModels';

@Component({
  selector: 'app-general-use-tabs',
  templateUrl: './general-use-tabs.component.html',
  styleUrls: ['./general-use-tabs.component.scss']
})
export class GeneralUseTabsComponent implements OnInit, OnChanges {
  @Output('changeTab') changeTab = new EventEmitter<tabs>();
  @Output() changeRoute = new EventEmitter<tabs>()
  @Input('tabArray') listOfTabs!: tabs[];
  @Input('tabGroupName') tabGroupName!: string
  tabToSelect!: tabs;
  constructor() { }

  ngOnChanges() {
   this.tabToSelect = this.listOfTabs[0];
  }

  ngOnInit(): void {
  }


  changeTabs(tab: tabs){
    this.tabToSelect = tab;
    this.changeTab.emit(tab);
    this.changeRoute.emit(tab);
  }
}
