import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApplicantSelectionStatistics } from '../models/applicant-selection.models';
import { SearchParams } from '../models/generalModels';

@Injectable({
  providedIn: 'root'
})
export class BroadCastService {
  private statisticsSubject = new BehaviorSubject<Partial<ApplicantSelectionStatistics>>({});
  private changeInViewSubject = new BehaviorSubject<null | 'Batch View' | 'Single View'>(null);
  private globalSearchSubject = new BehaviorSubject<null | Partial<SearchParams>>(null);
  public search$ = this.globalSearchSubject.asObservable();
  statistics$ = this.statisticsSubject.asObservable();
  public changeInViewSubject$ = this.changeInViewSubject.asObservable();
  constructor() { }


  broadCastStatistics(statistics: Partial<ApplicantSelectionStatistics>){
    this.statisticsSubject.next(statistics);
  }

  notifyParentComponentOfChangeInView(view: null | 'Batch View' | 'Single View'){
    this.changeInViewSubject.next(view);
  }

  broadCastSearchInformation(view: null | Partial<SearchParams>){
    this.globalSearchSubject.next(view);
  }

}
