import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-no-content-to-show',
  templateUrl: './no-content-to-show.component.html',
  styleUrls: ['./no-content-to-show.component.scss']
})
export class NoContentToShowComponent implements OnInit {
 @Output() refresh = new EventEmitter<string>()
  constructor() { }

  ngOnInit(): void {
  }

  refreshScreen(){
     this.refresh.emit('reload')
  }

}
