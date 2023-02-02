import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApplicantSelectionStatistics } from '../models/applicant-selection.models';

@Injectable({
  providedIn: 'root'
})
export class BroadCastService {
  private statisticsSubject = new BehaviorSubject<Partial<ApplicantSelectionStatistics>>({});
  private changeInViewSubject = new BehaviorSubject<null | 'Batch View' | 'Single View'>(null);
  statistics$ = this.statisticsSubject.asObservable();
  changeInViewSubject$ = this.changeInViewSubject.asObservable();
  constructor() { }


  broadCastStatistics(statistics: Partial<ApplicantSelectionStatistics>){
    this.statisticsSubject.next(statistics);
  }

  notifyParentComponentOfChangeInView(view: null | 'Batch View' | 'Single View'){
    this.changeInViewSubject.next(view);
  }

}
