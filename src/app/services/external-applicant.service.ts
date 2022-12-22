import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse, CandidateFiles, JobAppliedForByApplicant, RequiredApplicantDetails, TestDetails } from '../models/generalModels';

@Injectable({
  providedIn: 'root'
})
export class ExternalApplicantService {
  external_url = `${environment.externalCandidateBaseUrl}`;
  constructor(
    private http: HttpClient
  ) { }
  

  applyForJob(candidateDetails: Partial<RequiredApplicantDetails>): Observable<BaseResponse<null>>{
    return this.http.post<BaseResponse<null>>(`${this.external_url}${environment.externalApplicationApis.applyForJob}`, candidateDetails);
  }

  updateUser(candidateFileUploads: FormData): Observable<BaseResponse<null>>{
    return this.http.post<BaseResponse<null>>(`${this.external_url}${environment.externalApplicationApis.updateApplicantApplication}`, candidateFileUploads);
  }

  getApplicantJobs(email: string): Observable<BaseResponse<JobAppliedForByApplicant[]>>{
    const params = new HttpParams().set('Email', email)
    return this.http.get<BaseResponse<JobAppliedForByApplicant[]>>(`${this.external_url}${environment.externalApplicationApis.applicantJobs}`, {params});
  }

  getTestDetailsSentToApplicantsEmail(email: string): Observable<BaseResponse<TestDetails>>{
    const params = new HttpParams().set('Email', email)
    return this.http.get<BaseResponse<TestDetails>>(`${this.external_url}${environment.externalApplicationApis.getTestDetails}`, {params});
  }
  
}
