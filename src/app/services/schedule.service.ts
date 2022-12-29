import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/generalModels';
import { ASchedule, SearchedApplicant, StaffName, GetScheduleResponse, InterviewTypes } from '../models/scheduleModels';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  getApplicants(interviewType: number, applicantName: string): Observable<BaseResponse<SearchedApplicant[]>>{
    const url = `${environment.baseUrl}${environment.applicationSelection.searchApplicantsDueSchedule}`
    const params = new HttpParams().set('invitationType', interviewType).set('applicantName', applicantName)
    return this.http.get<BaseResponse<SearchedApplicant[]>>(url, {params})
  }

  getStaff(Department: string, StaffName: string): Observable<BaseResponse<StaffName[]>>{
    const url = `${environment.baseUrl}${environment.applicationSelection.searchStaffByDept}`
    const params = new HttpParams().set('Department', Department).set('StaffName', StaffName)
    return this.http.get<BaseResponse<StaffName[]>>(url, {params})
  }

  createSchedule(schedule: Partial<ASchedule>): Observable<BaseResponse<any>>{
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.schedule.createASchedule}`
    return this.http.post<BaseResponse<any>>(url, schedule, {headers});
  }

  getSchedules(startOfWeek: string, endOfWeek: string, inviteType?: InterviewTypes): Observable<GetScheduleResponse>{
    const params = new HttpParams().set('StartDate', startOfWeek).set('EndDate', endOfWeek).set('inviteType', inviteType ? inviteType : 0);
    const url = `${environment.baseUrl}${environment.schedule.getSchedules}`
    return this.http.get<GetScheduleResponse>(url, {params})
  }

  approveSchedule(req: { 
    scheduleId: number,
    scheduleRef: string,
    actionType: number,
    status: number,
    comment: string
  }): Observable<BaseResponse<any>>{
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}${environment.schedule.approveSchedule}`
    return this.http.post<BaseResponse<any>>(url, req, {headers});
  }
}
