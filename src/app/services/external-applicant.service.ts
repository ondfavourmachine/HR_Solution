import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AJob, BaseResponse, JobAppliedForByApplicant, PostAcceptanceInfo, RequiredApplicantDetails, TestDetails } from '../models/generalModels';

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

  getApplicantJobs<T>(urlToUse: string, email?: string, ): Observable<BaseResponse<T>>{
    let params!: HttpParams;
    email ? params = new HttpParams().set('Email', email as string) : null;
    if(email) {
      return this.http.get<BaseResponse<T>>(`${urlToUse}${environment.externalApplicationApis.applicantJobs}`, {params});
    }
    let token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<BaseResponse<T>>(`${urlToUse}${environment.externalApplicationApis.applicantJobs}`, {headers});
    
  }

  getTestDetailsSentToApplicantsEmail(email: string): Observable<BaseResponse<TestDetails>>{
    const params = new HttpParams().set('Email', email)
    return this.http.get<BaseResponse<TestDetails>>(`${this.external_url}${environment.externalApplicationApis.getTestDetails}`, {params});
  }

  getOfferLetterDetailsByApplicantsEmail(email: string): Observable<BaseResponse<TestDetails>>{
    const params = new HttpParams().set('Email', email)
    return this.http.get<BaseResponse<TestDetails>>(`${this.external_url}${environment.externalApplicationApis.getOfferLetterDetails}`, {params});
  }

  candidateAcceptanceOrRejection(req: { applicationRef: string,status: string, createdBy: any}){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<BaseResponse<TestDetails>>(`${this.external_url}${environment.externalApplicationApis.acceptOrRejectOffer}`, req, {headers});
  }

  addReferences(req: Partial<PostAcceptanceInfo>){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<BaseResponse<TestDetails>>(`${this.external_url}${environment.externalApplicationApis.addReferences}`, req, {headers});
  }

  addAcceptanceDocuments(req: Partial<PostAcceptanceInfo>){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData= new FormData();
    formData.append('ApplicationRefNo', req.applicationRefNo as string)
    formData.append('Passport', req.passport as File);
    formData.append('NYSC', req.nysc as File);
    formData.append('Degree', req.degree as File);
    formData.append('OLevel', req.olevel as File);
    formData.append('Certificate', req.certificate instanceof File ?  req.certificate as File : 'N/A');
    formData.append('NameChange', req.nameChange instanceof File ? req.nameChange as File : 'N/A');
    formData.append('Masters',  req.masters instanceof File ? req.masters as File : 'N/A');
    formData.append('Marriage', req.masters instanceof File ? req.marriage as File: 'N/A')
    return this.http.post<BaseResponse<TestDetails>>(`${this.external_url}${environment.externalApplicationApis.addDocumentsForAcceptance}`, formData, {headers});
  }
  
}
