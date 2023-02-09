import { ElementRef, Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { AGlobusBranch, AnApplication, BaseResponse, ClassOfDegree, DepartmentsInGlobus, GRADES, InformationForApprovalModal, JobCategories, JobToBeCreated, JobToBeCreatedKeys, JobType, NYSCStrings, UnitsInGlobus } from '../models/generalModels';
import { Observable } from 'rxjs';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { ages, convertToBytesToMB } from './small_reusable_functions';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SuccessfulInitiationComponent } from '../shared/successful-initiation/successful-initiation.component';
import { InterviewSummaryComponent } from '../shared/interview-summary/interview-summary.component';
import { saveAs  } from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
   private fileSizeLimit: number = 2;
   constructor(private http: HttpClient, private _snackBar:MatSnackBar, private dialog: MatDialog, private datePipe: DatePipe) {
    
   }

  async getDepartments(): Promise<BaseResponse<DepartmentsInGlobus[]>>{
    const url = `${environment.baseUrl}${environment.departments.getDept}`
   const res = await  fetch(url, {
    method: 'GET'
   });
   return await res.json();
  }

  getUnits(deptId: any): Observable<BaseResponse<UnitsInGlobus[]>>{
    const url = `${environment.baseUrl}${environment.units.getUnitsByDept}`
    const params = new HttpParams().set('DeptID', deptId)
    return this.http.get<BaseResponse<UnitsInGlobus[]>>(url, {params})
  }

  getBranchesInGlobus(): Observable<BaseResponse<AGlobusBranch[]>>{
    const url = `${environment.baseUrl}${environment.branches.branchesInGlobus}`
    return this.http.get<BaseResponse<AGlobusBranch[]>>(url)
  }

  convertGradesToArray(){
    return Object.values(GRADES).filter(elem => isNaN(parseInt(elem)))
  }

  convertJobTypesToArray(){
    return Object.values(JobType).filter(elem => isNaN(parseInt(elem as string)));
  }

  convertJobCategoryToArray(){
    return Object.values(JobCategories).filter(elem => isNaN(parseInt(elem as string)));
  }

  convertClassOfDegreeToArray(){
    return Object.values(ClassOfDegree).filter(elem => isNaN(parseInt(elem as string)));
  }

  convertNyscStringsToArray(){
    return Object.values(NYSCStrings).filter(elem => isNaN(parseInt(elem)));
  }


  errorSnackBar(message: string, action: string = ''){
    const config: MatSnackBarConfig = {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: "error-snackBar",
      duration: 3000
    }
    this._snackBar.open(message, action, config);
  }

  successSnackBar(message: string, action: string = '', duration?: number): void{
    const config: MatSnackBarConfig = {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: "success-snackbar",
      duration: duration || 3000
    }
    this._snackBar.open(message, action, config);
  }


  loading4button(
    button: HTMLButtonElement | HTMLAnchorElement,
    apiCall: 'yes' | 'done',
    displayString?: string
  ) {
    if(button instanceof HTMLButtonElement){
        switch (apiCall) {
        case "yes":
          button.innerText = "";
          button.disabled = true;
          button.innerHTML = `${displayString}  <i class="fa fa-sync fa-spin ml-1"></i>`;
          break;
        case "done":
          button.innerHTML = "";
          button.disabled = false;
          button.innerHTML = `${displayString || "Submit"}`;
      }
    }else{
      switch (apiCall) {
        case "yes":
          button.innerText = "";
          button.style.pointerEvents = 'none';
          button.innerHTML = `${displayString}  <i class="fa fa-sync fa-spin ml-1"></i>`;
          break;
        case "done":
          button.innerHTML = "";
          button.style.pointerEvents  = 'auto';
          button.innerHTML = `${displayString || "Submit"}`;
      }
    } 
  }

  insertIntoAdjacentHtmlOfElement<T extends Element, K extends ElementRef<T>, S extends string>(
    obj: {element: K, content: S}[]
  ){
   obj.forEach(elem => elem.element.nativeElement.insertAdjacentHTML('beforeend', elem.content));
  }

  clearInnerHtmlOfElement<T extends Element, K extends ElementRef<T>>(obj: K[]){
    obj.forEach(elem => elem.nativeElement.textContent = '');
  }

  fillUpJobObject<T extends JobToBeCreated, K extends JobToBeCreatedKeys >(obj: T, args: K[]){
    args.forEach(elem => obj[elem] = elem as never);
  }


  insertLisIntoUl(str: string): string{
    const regex = new RegExp('<li\s*.*>\s*\w*<\/li>', 'igm');
    const matches = regex.exec(str);
    try {
     return (matches as RegExpExecArray)[0];
    } catch (error) {
     return '';
    }
   };


  showAllChildren(elements: ElementRef<HTMLElement>[]){
    elements.forEach(elem => {
      const p = elem.nativeElement.querySelectorAll('p');
      p.length > 0 ? Array.from(p).forEach(element => element.style.display = 'inline'): null;
    })
  }

  fileToBeStoredIsLessThanPreferredFileSize(filesize: number): boolean{
    return convertToBytesToMB(filesize) <= this.fileSizeLimit;
  }

  getUnitName(unitName: string): string | undefined{
    if(!unitName) return undefined;
    return unitName && typeof unitName == 'string' ?  unitName.split('/')![0] : '';
  }

  triggerSuccessfulInitiationModal(message: string, buttonText?: string, callBack?: Function){
   const data:InformationForApprovalModal<string, string, Function> = {message, button: buttonText as any, callBack}
    const config: MatDialogConfig = {
      width: '28vw',
      height: '38vh',
      panelClass: 'successfulInitiationComponent',
      data,     
    }
    this.dialog.open(SuccessfulInitiationComponent, config)
  }

  displayInterviewDetails(data: any){
    const config: MatDialogConfig = {
      panelClass: 'interview_summary_comp',
      width: '75vw',
      height: '75vh',
      data,
    }
    const dialog =  this.dialog.open(InterviewSummaryComponent, config);
    return dialog;
  }

  getRole(): string {
    return sessionStorage.getItem('role') as string;
  }

  getEmailOfLoggedInUser(): string {
    return sessionStorage.getItem('email') as string;
  }

  generateAges(){
    return ages(20, 61).sort();
  }

  downloadFile(url?: string | null | undefined){
    if(!url || url.length < 1) {
      this.errorSnackBar(`We didn't find the CV for this applicant!`);
      return;
    }
    const a = document.createElement('a') as HTMLAnchorElement;
    a.href = url as string;
    a.setAttribute('download', '');
    a.click();
  }

  reformatANumber(val: any){
    return new Intl.NumberFormat('en').format(val)
  }

  convertToHumanReadableFileSize(filesize?: number){
    const bytes = 1024
    const kilobyte = 1 * bytes;
    const megabyte = kilobyte * bytes;
    return `${(filesize! / megabyte).toFixed(2)}MB`
  }

  downloadAsExcel(reportData: any[] | Partial<any>[], fileName: string){
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const excelBuffer = this.generateExcelFile(reportData as any[]);
    const blob: Blob = new Blob([excelBuffer], {type: EXCEL_TYPE});
    saveAs(blob, `${fileName}_exported${EXCEL_EXTENSION}`);
  }

  downloadAsPdf(data: any[], fileName: string) {
    const blobPart = JSON.stringify(data);
    const PDF_TYPE = 'application/pdf;charset=UTF-8';
    const PDF_EXTENSION = '.pdf';
    const blob: Blob = new Blob([blobPart], {type: PDF_TYPE});
    saveAs(blob, `${fileName}_exported${PDF_EXTENSION}`);
  }


generateExcelFile(dataToConvertToExcel: Array<any>): any{
  const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToConvertToExcel);
  const workBook: XLSX.WorkBook = {Sheets: {'data': workSheet}, SheetNames: ['data']}
  const excelBuffer: any = XLSX.write(workBook, {bookType: 'xlsx', type: 'array'})
  return excelBuffer;
} 

covertDateToHumanFreiendlyFormat(date: string | Date, format: string): string | null{
  return this.datePipe.transform(date, format);
}

getClassToDisplay(applicant: AnApplication) : string{ 
  if((applicant.approverStatus == 'Awaiting' && applicant.hR_Status == 'Rejected') || applicant.hR_Status == 'Rejected' || applicant.hR_Status == 'Returned') return 'Rejected';
  if(applicant.approverStatus == 'Awaiting') return 'Waiting';
  if(applicant.approverStatus == 'Pending' || applicant.hR_Status == 'Pending' || applicant.hR_Status == '') return 'Pending';
  return 'Approved';
}


  
  
}
