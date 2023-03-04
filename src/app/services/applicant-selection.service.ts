import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApplicantsSelectionResponse } from '../models/applicant-selection.models';
import {ApprovalRequestBody, BaseResponse, SearchParams } from '../models/generalModels';

@Injectable({
  providedIn: 'root'
})
export class ApplicantSelectionService {

  constructor(private http: HttpClient) { }

  getApplicants(searchParams: Partial<SearchParams>): Observable<ApplicantsSelectionResponse>{
    if('ApplicantName' in searchParams && searchParams!.ApplicantName!.length < 1){
      delete searchParams.ApplicantName;
    }
    const params: HttpParams = Object.keys(searchParams).reduce((prev, curr) => prev.set(curr, (searchParams as SearchParams)[curr as keyof SearchParams]), new HttpParams());
    const url = `${environment.baseUrl}${environment.applicationSelection.getApplication}`
    return this.http.get<ApplicantsSelectionResponse>(url, {params});
  }

  selectAnApplicant(req: ApprovalRequestBody): Observable<BaseResponse>{
    // const token = sessionStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.applicationSelection.approveAnApplication}`;
    return this.http.post<BaseResponse>(url, req);
  }


  rejectAnApplicant(){}
}
