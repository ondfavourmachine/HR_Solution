import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AJob, BaseResponse } from '../models/generalModels';
@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient) { }

  createAJob(obj: any): Observable<BaseResponse>{
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.jobApis.creatJob}`
    return this.http.post<BaseResponse>(url,obj, {headers});
  }

  getJobBasedOnStatus(status: 'Pending' | 'Approve'): Observable<BaseResponse<AJob[]>>{
    const url = `${environment.baseUrl}${environment.jobApis.getPendingJobs}`
    const params = new HttpParams().set('Status', status);
    return this.http.get<BaseResponse<AJob[]>>(url, {params});
  }

  approveAJob(job: {jobId: number,status: number,comment: string}): Observable<BaseResponse>{
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const url = `${environment.baseUrl}${environment.jobApis.approveJob}`
    return this.http.post<BaseResponse>(url, job, {headers});
  }

  getJobByID(jobId: any): Observable<BaseResponse<AJob>>{
    const params = new HttpParams().set('JobId', jobId)
    const url = `${environment.baseUrl}${environment.jobApis.getAJob}`
    return this.http.get<BaseResponse<AJob>>(url, {params});
  }

  
}
