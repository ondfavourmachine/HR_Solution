import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ObsCallBack, Pagination, paginationOptions } from '../models/generalModels';
// import { ApplicantSelectionComponent } from '../pages/applicant-selection/applicant-selection.component';

@Injectable({
  providedIn: 'root'
})
export class PaginationService  implements Pagination {
  paginationData = new Map<number, Array<any>>();
  page = 1;
  pageLimit: number = 10;
  endNumber = this.pageLimit;
  currentPage = 1;
  currentPageSet: any[] = [];
  nextPageSelection = 0;
  prevPageSelection = 0;
  numberOfPages = 0;
  arrayOfPagesSet: any[] = [];
  startDate = new Date(Date.now() - 31556952000);
  endDate = Date.now();
  updatePaginationData: boolean = false;
  // updatePaginationDate: boolean = false;
  constructor(private datePipe: DatePipe) { }


  calculatePagination<T>(data: T[], totalPage: number): void {
    let sliceFirstNumber = 0;
    let sliceSecondNumber = this.pageLimit;
    if(this.updatePaginationData){
      this.paginationData.set(this.currentPage, data.slice(sliceFirstNumber, sliceSecondNumber));
      return;
    }
    this.numberOfPages = Math.ceil(totalPage / parseInt(this.pageLimit.toString()));
    let currentPage = 1;
    for(let i = 0; i < this.numberOfPages; i++){
      this.paginationData.set(currentPage, data.slice(sliceFirstNumber, sliceSecondNumber));
      sliceFirstNumber = sliceSecondNumber;
      sliceSecondNumber = sliceSecondNumber + parseInt(this.pageLimit.toString());
      currentPage++;
    }
  }

  getAPageOfPaginatedData<T>(page?: number): T[]{
    return this.paginationData.get(page ?? this.currentPage) as T[];
  }
 
 generatePagesForView():void {
  const arrayOfKeys = Array.from(this.paginationData.keys());
  const arrayOfPagesSets = [];
  let startIndex = 0;
  let incrementer = 4;
  const lastIndex = arrayOfKeys.length - 1;
  while(startIndex <= lastIndex){
    const slice = arrayOfKeys.slice(startIndex, incrementer);
    arrayOfPagesSets.push(slice);
    startIndex = startIndex + 4;
    incrementer = incrementer + 4;
  }
  this.currentPageSet = arrayOfPagesSets[0];
  this.prevPageSelection = arrayOfPagesSets.indexOf(this.currentPageSet) == 0 ? 0 : this.nextPageSelection;
  this.nextPageSelection++;
  this.arrayOfPagesSet = arrayOfPagesSets;
 };

 selectAnotherPage(page: any, obsCallBack: ObsCallBack,paginationOptions?: paginationOptions): void {
  if(paginationOptions) {
    this.currentPage = paginationOptions.currentPageToSet as number;
    this.updatePaginationData = true;
  }
  obsCallBack(page, this.pageLimit)
 }
 generateStartDate(date?: Date):string {
   const dateToUse = date ? date : this.startDate;
   const returnVal = this.datePipe.transform(dateToUse, 'dd/MM/yyyy') as string;
   return returnVal;
 };
 generateEndDate(date?: Date): string{
   const dateToUse = date ? date : this.endDate;
   const returnVal = this.datePipe.transform(dateToUse, 'dd/MM/yyyy') as string;
   return returnVal;
 };
 clearPaginationStuff(): void{
  this.paginationData = new Map();
  this.page = 1;
  this.pageLimit = 10;
  this.endNumber = this.pageLimit;
  this.currentPage = 1;
  this.currentPageSet = [];
  this.nextPageSelection = 0;
  this.prevPageSelection = 0;
  this.numberOfPages = 0;
  this.arrayOfPagesSet = [];
  this.startDate = new Date(Date.now() - 31556952000);
  this.endDate = Date.now();
  this.updatePaginationData = false;
 }

 loadNextSetOfPages<T>(obj: {ApplicationStage: number, noOfRecord?: number},  callBack: (ApplicationStage?: number, pageNumber?: number, noOfRecord?: number) => void): T[] | void{
  const lastPageInSet = this.currentPageSet.slice(-1)[0];
    if(this.currentPage == lastPageInSet){
      this.prevPageSelection = this.nextPageSelection;
      this.currentPageSet = this.arrayOfPagesSet[this.nextPageSelection];
      this.nextPageSelection++;
      this.currentPage = this.currentPageSet[0];
      return this.paginationData.get(this.currentPage)!.length < 1 ? callBack(obj.ApplicationStage, this.currentPageSet[0], obj.noOfRecord) : this.getAPageOfPaginatedData(this.currentPage);
    }else{
      const index = this.currentPageSet.indexOf(this.currentPage);
      this.currentPage = this.currentPageSet[index + 1];
      return this.paginationData.get(this.currentPage)!.length < 1 ?  callBack(obj.ApplicationStage,this.currentPageSet[0], obj.noOfRecord) : this.getAPageOfPaginatedData(this.currentPage);
    }
 }

 loadPreviousSetOfPages<T>(obj: {ApplicationStage: number, pageNumber?: number, noOfRecord?: number},  callBack: Function): T[] | void{
  const firstPageInSet = this.currentPageSet.slice(0)[0];
  if(this.currentPage == firstPageInSet){
    this.nextPageSelection = this.prevPageSelection;
    this.currentPageSet = this.arrayOfPagesSet[this.prevPageSelection - 1];
    this.prevPageSelection--;
    this.currentPage = this.currentPageSet[this.currentPageSet.length - 1];
    return this.paginationData.get(this.currentPage)!.length < 1 ?  callBack(this.currentPageSet[this.currentPageSet.length - 1]) : this.getAPageOfPaginatedData(this.currentPage);
  }else{
    const index = this.currentPageSet.indexOf(this.currentPage);
    this.currentPage = this.currentPageSet[index - 1];
    return this.paginationData.get(this.currentPage)!.length < 1 ?  callBack(this.currentPageSet[index - 1]) : this.getAPageOfPaginatedData(this.currentPage);
  }
 }

 fillUpPaginationMasterTableWithData(){}

}
