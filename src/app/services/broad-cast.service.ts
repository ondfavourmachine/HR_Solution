import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApplicantSelectionStatistics } from '../models/applicant-selection.models';

@Injectable({
  providedIn: 'root'
})
export class BroadCastService {
  private statisticsSubject = new BehaviorSubject<Partial<ApplicantSelectionStatistics>>({});
  statistics$ = this.statisticsSubject.asObservable();
  constructor() { }


  broadCastStatistics(statistics: Partial<ApplicantSelectionStatistics>){
    this.statisticsSubject.next(statistics);
  }

}
