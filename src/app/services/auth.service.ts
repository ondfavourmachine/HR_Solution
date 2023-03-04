import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {  BaseResponse, GeneratedToken, Role, StaffDetailsFromAd } from '../models/generalModels';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth_url = `${environment.baseUrl}${environment.authUrl.login}`;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  saveItemInCache(itemLocation: string, item: any): void{
    const keyname = window.btoa(itemLocation);
    const itemEnq = window.btoa(item);
    sessionStorage.setItem(keyname, itemEnq);
   }

   retrieveItemStoredInCache(keyname: string): string{
    const res =sessionStorage.getItem(window.btoa(keyname)) as string;
    return window.atob(res);
   }
  shouldAllowAccessToRoute(): boolean{
    const t = this.retrieveItemStoredInCache(environment.cacher.jeton);
    return t != null ;
  }
 
  authenticateUser(req: {LoginText: string}):Observable<{loginResult: string}>{
    return this.http.post<{loginResult: string}>(this.auth_url, req)
    .pipe(timeout(100000))
  }

  getRoles(): Observable<BaseResponse<Role>>{
    const url = environment.baseUrl + 'Role/GetRoles';
    return this.http.get<BaseResponse<Role>>(url)
    .pipe(timeout(100000))
  }

  getRole(): string {
    return this.retrieveItemStoredInCache(environment.cacher.ruolo) as string;
  }

  getEmailOfLoggedInUser(): string {
    return this.retrieveItemStoredInCache(environment.cacher.ríomhphost) as string;
  }

  searchForGlobusStaffByUserName(name: string): Observable<BaseResponse<StaffDetailsFromAd>>{
    const url = environment.baseUrl + `Staff/GetStaffById/${name}`;
    return this.http.get<BaseResponse<StaffDetailsFromAd>>(url)
    .pipe(timeout(100000))
  }

  changeUserRole(req:{userName: string, roleName: string}): Observable<any>{
    const url = environment.baseUrl + 'Role/AssignRole';
    return this.http.post<any>(url, req)
    .pipe(timeout(100000))
  }

  addStaffToHrSolution(req: { lookUpCode: string,lookUpEmail: string, lookUpName: string}){
    // const token = this.retrieveItemStoredInCache(environment.cacher.jeton);
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = environment.baseUrl + `LookUp/AddLookUp`;
    return this.http.post<BaseResponse>(url, req)
    .pipe(timeout(100000))
  }

  // this function is only for use during test, will be removed very soon
  generateToken(req: {username: string, password: string, token: string}): Observable<BaseResponse<GeneratedToken>>{
    const url  = environment.baseUrl + 'Authenticate/GenerateToken';
    return this.http.post<any>(url, req)
    .pipe(timeout(100000))
  }

  async clearSession(){
    const u = this.retrieveItemStoredInCache(environment.cacher.ríomhphost);
    const url  = environment.baseUrl + 'Authenticate/LogOut';
    const params = new HttpParams().set('Email', u as string);
    await lastValueFrom(this.http.post<any>(url, {}, {params}));
    sessionStorage.clear();
  }

}
