import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApplicantSelectionStatistics } from '../models/applicant-selection.models';
import { SearchParams } from '../models/generalModels';

@Injectable({
  providedIn: 'root'
})
export class BroadCastService {
  private statisticsSubject = new BehaviorSubject<Partial<ApplicantSelectionStatistics>>({});
  private changeInViewSubject = new BehaviorSubject<null | 'Batch View' | 'Single View'>(null);
  private globalSearchSubject = new BehaviorSubject<null | Partial<SearchParams> | string>(null);
  public search$ = this.globalSearchSubject.asObservable();
  statistics$ = this.statisticsSubject.asObservable();
  public changeInViewSubject$ = this.changeInViewSubject.asObservable();
  private applicantDataHasBeenLoadedSubject = new Subject<boolean>();
  applicantDataHasBeenLoaded$ = this.applicantDataHasBeenLoadedSubject.asObservable();
  constructor() { }


  broadCastStatistics(statistics: Partial<ApplicantSelectionStatistics>){
    this.statisticsSubject.next(statistics);
  }

  notifyParentComponentOfChangeInView(view: null | 'Batch View' | 'Single View'){
    this.changeInViewSubject.next(view);
  }

  broadCastSearchInformation(view: null | Partial<SearchParams> | string){
    this.globalSearchSubject.next(view);
  }

  broadCastLoadModalInfo(val: boolean){
    this.applicantDataHasBeenLoadedSubject.next(val)
  }

}
