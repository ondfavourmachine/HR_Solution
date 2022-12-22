import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseResponse, GeneralLookUp } from '../models/generalModels';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookUpService {
  url = `${environment.baseUrl}`;
  constructor(
    private http: HttpClient
  ) { }

  getStates(): Observable<BaseResponse<GeneralLookUp[]>>{
    return this.http.get<BaseResponse<GeneralLookUp[]>>(`${this.url}${environment.lookUps.getStates}`)
  }

  getUniversities(): Observable<BaseResponse<GeneralLookUp[]>>{
    return this.http.get<BaseResponse<GeneralLookUp[]>>(`${this.url}${environment.lookUps.getUniversitiesInNigeria}`)
  }

  getDegrees(): Observable<BaseResponse<GeneralLookUp[]>>{
    return this.http.get<BaseResponse<GeneralLookUp[]>>(`${this.url}${environment.lookUps.getDegrees}`)
  }
}
