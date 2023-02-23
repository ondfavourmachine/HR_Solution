import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthResponse, BaseResponse, GeneratedToken, Role, StaffDetailsFromAd } from '../models/generalModels';
import { SharedService } from './sharedServices';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth_url = `${environment.baseUrl}${environment.authUrl.login}`;
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router
  ) { }

  shouldAllowAccessToRoute(): boolean{
    const t = this.sharedService.getItemFromCache(environment.cacher.jeton);
    return t != null ;
  }
 
  authenticateUser(req: {username: string, password: string}):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(this.auth_url, req)
    .pipe(timeout(100000))
  }

  getRoles(): Observable<BaseResponse<Role>>{
    const url = environment.baseUrl + 'Role/GetRoles';
    return this.http.get<BaseResponse<Role>>(url)
    .pipe(timeout(100000))
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
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = environment.baseUrl + `LookUp/AddLookUp`;
    return this.http.post<BaseResponse>(url, req, {headers})
    .pipe(timeout(100000))
  }

  // this function is only for use during test, will be removed very soon
  generateToken(req: {username: string, password: string, token: string}): Observable<BaseResponse<GeneratedToken>>{
    const url  = environment.baseUrl + 'Authenticate/GenerateToken';
    return this.http.post<any>(url, req)
    .pipe(timeout(100000))
  }

//   createRole(req:{username: string, role: string}): Observable<GenericResponse<null>>{
//     const url = `${environment.general_url}Auth/AddUser`
//     return this.http.post<GenericResponse<null>>(url, req);
//   }
//   set setUserAccessRole(value: RoleInTPP){
//     this.loggedInUserAccessRight = value;
//   }

//   get userIsApprover(): RoleInTPP | null{
//     if(!this.loggedInUserAccessRight){
//       return null;
//     }
//     return this.loggedInUserAccessRight;
//   } 


}
