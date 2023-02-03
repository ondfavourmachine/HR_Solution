import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AJob, AnApplication, BaseResponse, JobCategories, JobToBeCreated, RequiredApplicantDetails } from '../models/generalModels';
@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient) { }

  createAJob(obj: any): Observable<BaseResponse>{
    // const token = sessionStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.jobApis.creatJob}`
    return this.http.post<BaseResponse>(url,obj, {headers: this.getHeaders});
  }

  getJobBasedOnStatus(status: 'Pending' | 'Approve', category?: JobCategories): Observable<BaseResponse<AJob[]>>{
    const url = `${environment.baseUrl}${environment.jobApis.getPendingJobs}`
    let params = new HttpParams().set('Status', status);
    params = category ? params.set('Category', category) : params;
    return this.http.get<BaseResponse<AJob[]>>(url, {params});
  }
  

  approveAJob(job: {jobId: number,status: number,comment: string}): Observable<BaseResponse>{
    // const token = sessionStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const url = `${environment.baseUrl}${environment.jobApis.approveJob}`
    return this.http.post<BaseResponse>(url, job, {headers: this.getHeaders});
  }

  getJobByID(jobId: any): Observable<BaseResponse<AJob>>{
    const params = new HttpParams().set('JobId', jobId)
    const url = `${environment.baseUrl}${environment.jobApis.getAJob}`
    return this.http.get<BaseResponse<AJob>>(url, {params});
  }

  getJobsByCategory(category: JobCategories): Observable<BaseResponse<AJob[]>>{
    const params = new HttpParams().set('Category', category)
    const url = `${environment.baseUrl}${environment.jobApis.getJobByCategory}`
    return this.http.get<BaseResponse<AJob[]>>(url, {params, headers: this.getHeaders});
  }

  getJobOfAnInternalCandidate(jobId: any): Observable<BaseResponse<AnApplication[]>>{
    const params = new HttpParams().set('jobId', jobId)
    const url = `${environment.baseUrl}${environment.jobApis.getJobOfAnInternalCandidate}`
    return this.http.get<BaseResponse<AnApplication[]>>(url,{headers: this.getHeaders, params});
  }

  // applyForInternalJob(){

  // }

  saveJobAsADraft(draft: JobToBeCreated): Observable<BaseResponse<any>>{
    // const token = sessionStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    const url = `${environment.baseUrl}${environment.jobApis.createDraft}`
    return this.http.post<BaseResponse<any>>(url, draft, {headers: this.getHeaders});
  }

  checkForDrafts(): Observable<BaseResponse<AJob[]>>{
    // const token = sessionStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.jobApis.getDraft}`;
    return this.http.get<BaseResponse<AJob[]>>(url, {headers: this.getHeaders});
  }

  deleteDrafts(id: any){
    // const token = sessionStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.jobApis.deleteDrafts}`;
    const params = new HttpParams().set('draftId', id);
    return this.http.post<BaseResponse<any>>(url, {}, {headers: this.getHeaders, params: params});
  }

  internalCandidateJobApplication(candidateDetails: Partial<RequiredApplicantDetails>): Observable<BaseResponse<null>>{
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.jobApis.internalCandidateJobApplication}`;
      return this.http.post<BaseResponse<null>>(`${url}`, candidateDetails, {headers});
  }

  internalCandidateJobApplicationUpload(candidateFileUploads: FormData): Observable<BaseResponse<null>>{ 
    const url = `${environment.baseUrl}${environment.jobApis.internalCandidateJobApplicationUpload}`;
    return this.http.post<BaseResponse<null>>(`${url}`, candidateFileUploads, {headers: this.getHeaders})
  }

get  getHeaders(){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }

  deleteJobs(req: {
    jobId: number,
    actionType: number,
    status: number,
    comment: string
  }){
    const url = `${environment.baseUrl}${environment.jobApis.deactivate}`;
    return this.http.post<BaseResponse<null>>(`${url}`, req, {headers: this.getHeaders})
  }

  
}
