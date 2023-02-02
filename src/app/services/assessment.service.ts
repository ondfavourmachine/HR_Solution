import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssessmentDetails, AssessmentResponseDS, RatingsInformationOnAnApplicant, RequiredDetailsFromInterviewChair } from '../models/assessment.models';
import { ApplicationApprovalStatus, BaseResponse, SearchParams } from '../models/generalModels';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private http: HttpClient) { }


  getAssesmentsByParameters<T>(searchParams: Partial<SearchParams>): Observable<AssessmentResponseDS<T>>{
    const params: HttpParams = Object.keys(searchParams).reduce((prev, curr) => prev.set(curr, (searchParams as SearchParams)[curr as keyof SearchParams]), new HttpParams());
    const url = `${environment.baseUrl}${environment.assessment.getAssessments}`
    return this.http.get<AssessmentResponseDS<T>>(url, {params});
  }

  getOneAssessment(ScheduleRef: string, ApplicationRef: string): Observable<BaseResponse<AssessmentDetails>>{
    const params: HttpParams = new HttpParams().set('ScheduleRef', ScheduleRef).set('ApplicationRef', ApplicationRef)
    const url = `${environment.baseUrl}${environment.schedule.getOneScheduleByScheduleRef}`
    return this.http.get<BaseResponse<AssessmentDetails>>(url, {params});
  }

  addApplicantTest(req: { applicationRef: string,score: number,status: string,comment?: string}){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.assessment.addApplicationTest}`
    return this.http.post<any>(url, req, {headers});
  }

  approveTestScore(req: {applicationRefNo: string, status: ApplicationApprovalStatus,comment: string}){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.assessment.approveTestScore}`
    return this.http.post<any>(url, req, {headers});
  }

  uploadATestScore(req: {SchRef: string, scoreSheet: File}){
    const formData= new FormData();
    formData.append('SchRef', req.SchRef);
    formData.append('ScoreSheet', req.scoreSheet)
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.assessment.uploadATestScore}`
    return this.http.post<any>(url, formData, {headers});
  }

  addInterviewChairDetails(req: Partial<RequiredDetailsFromInterviewChair>){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.assessment.addInterviewChairDetailsForAnInterview}`
    return this.http.post<any>(url, req, {headers});
  }

  addRatingForAnApplicantDuringInterview(req: Partial<RatingsInformationOnAnApplicant>){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.assessment.addInterviewerRatingsForAnApplicant}`
    return this.http.post<any>(url, req, {headers});
  }

  calculateScore(req: Partial<RatingsInformationOnAnApplicant>): Observable<number>{
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.assessment.calculateScore}`
    return this.http.post<any>(url, req, {headers});
  }

  getInterviewersGradingForAnApplicant(req: {mail: string,scheduleRef: string,applicationRef: string}): Observable<RatingsInformationOnAnApplicant>{
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.assessment.getGradesByAnInterviewer}`
    return this.http.post<any>(url, req, {headers});
  }

  getAllTestBatches<T>(searchParams: Partial<SearchParams>): Observable<AssessmentResponseDS<T>>{
    const params: HttpParams = Object.keys(searchParams).reduce((prev, curr) => prev.set(curr, (searchParams as SearchParams)[curr as keyof SearchParams]), new HttpParams());
    const url = `${environment.baseUrl}${environment.assessment.getTestBatches}`
    return this.http.get<AssessmentResponseDS<T>>(url);
  }

  fetchASingleBatch<T>(searchParams: Partial<SearchParams> & {scheduleRef: string}): Observable<AssessmentResponseDS<T>>{
    //scheduleRef
    const params: HttpParams = Object.keys(searchParams).reduce((prev, curr) => prev.set(curr, (searchParams as SearchParams)[curr as keyof SearchParams]), new HttpParams());
    const url = `${environment.baseUrl}${environment.assessment.getApplicantsInOneBatch}`
    return this.http.get<AssessmentResponseDS<T>>(url, {params});
  }

}
