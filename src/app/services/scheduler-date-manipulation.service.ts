import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { eachQuarterOfInterval, isToday, getQuarter, startOfWeek, getWeek, lastDayOfMonth, isWeekend, startOfMonth, eachDayOfInterval, endOfWeek, monthsInYear  } from 'date-fns';
import { DateTime, Info } from 'luxon';
import { RequiredQuarterFormat } from '../models/generalModels';

@Injectable({
  providedIn: 'root'
})
export class SchedulerDateManipulationService {
 currentWeek: number = this.getCurrentWeekOfYear()
  constructor(private datePipe: DatePipe) {
    this.dateIsAWeekDay = this.dateIsAWeekDay.bind(this);
   }

   getCurrentYear(): number{
    return new Date(Date.now()).getFullYear();
   }

  startDayOfCurrentMonth(): Date{
    return startOfMonth(Date.now());
  }

  lastDayOfCurrentMonth(): Date{
    return lastDayOfMonth(Date.now());
  }

  getDatesInCurrentMonth(): Array<Date>{
    const datesOfCurrentMonth = eachDayOfInterval({
      start: this.startDayOfCurrentMonth(),
      end: this.lastDayOfCurrentMonth()
    });
    return datesOfCurrentMonth;
  }

  dateIsAWeekDay(date: Date): boolean{
    return !isWeekend(date);
  }

  getStartWeek(): string | Date{
    return startOfWeek(Date.now(), {weekStartsOn: 0});
  }

  getEndWeek(): string | Date{
    return endOfWeek(Date.now(), {weekStartsOn: 0});
  }

  startDayOfCurrentYear(): Date{
    return new Date(`${new Date().getFullYear()}`);
  }

  endDateOfCurrentYear(): Date{
    return new Date(new Date().getFullYear(), 11, 31)
  }

  getHumanNameForQuarter(num: number): string{
    let returnVal!: string;
    switch(num){
      case 0:
      returnVal = 'First'
      break;
      case 1:
      returnVal = 'Second';
      break;
      case 2:
      returnVal = 'Third';
      break;
      case 3:
      returnVal = 'Fourth';
      break;
    }

    return returnVal;
  }

  getLastDayOfPreviousQuarter(date: Date){
    return new Date(date.getTime() - (1000 * 60 * 60 *24));
  }

  generateQuartersOfCurrentYear(): Date[]{
    const result = eachQuarterOfInterval({
       start: this.startDayOfCurrentYear(),
       end: this.endDateOfCurrentYear()
     });
     return result;
   }

   getCurrentQuarter(){
     return getQuarter(Date.now());
   }

   getCurrentWeekOfYear(): number{
    return getWeek(Date.now(), { firstWeekContainsDate: 2})
   }

   getDaysOfCurrentWeek(): Array<Date>{
    const dObj = DateTime.fromObject({
      weekYear: this.getCurrentYear(),
      weekNumber: this.currentWeek
    })
    const aDayInMilliseconds = 1000 * 60 * 60 * 24;
    let startDayOfCurrentWeek = new Date(new Date(dObj.startOf('week').year, dObj.startOf('week').month - 1, dObj.startOf('week').day).getTime() - aDayInMilliseconds);
    let lasttDayOfCurrentWeek = new Date(new Date(dObj.endOf('week').year, dObj.endOf('week').month - 1, dObj.endOf('week').day).getTime() - aDayInMilliseconds);
    const arrayOfDates = [startDayOfCurrentWeek];
    while(startDayOfCurrentWeek.getTime() < lasttDayOfCurrentWeek.getTime()){
      startDayOfCurrentWeek = new Date(startDayOfCurrentWeek.getTime() + aDayInMilliseconds);
      arrayOfDates.push(startDayOfCurrentWeek);
    }
    return arrayOfDates
   }

   getWeeksInYear(): number{
     return DateTime.fromObject({weekYear: new Date(Date.now()).getFullYear()}).weeksInWeekYear
   }

   getNextWeekDays(): Date[]{
    this.currentWeek == this.getWeeksInYear() ? this.currentWeek = 1 : this.currentWeek = this.currentWeek + 1
    const weekDays = this.getDaysOfCurrentWeek();
    return weekDays
   }

   getPrevWeekDays(): Date[]{
    this.getWeeksInYear() - this.currentWeek == 0 ? this.currentWeek = 1 : this.currentWeek = this.currentWeek - 1
    const weekDays = this.getDaysOfCurrentWeek();
    return weekDays
   }

   getDayNames(dates: Array<Date>): string[]{
     const stringFormOfDate = dates.map(elem => this.datePipe.transform(elem, 'EEEE, d,'))
     return stringFormOfDate as string[];
   }

   getCurrentMonth(): string{
    const currentMonth = this.datePipe.transform(Date.now(), 'MMMM');
    return `${currentMonth} ${new Date().getFullYear()}`
   }

   checkIfDayIsCurrentDay(date: Date){
    return isToday(date);
   }

   getMonthsOfYear(){
    return Info.months();
   }

   getMonthInHumanReadableFormat(date: Date){
    console.log({
      year: date.getFullYear(), 
      month: date.getMonth() + 1,
      day: date.getDate()
    })
    return DateTime.local(date.getFullYear(), date.getMonth() + 1, date.getDate()).monthLong;
   }


   presentQuartersInHumanReadableFormat(dates: Date[]): RequiredQuarterFormat[]{
    const arrOfHumanReadableDateForms: RequiredQuarterFormat[]  = [];
    for(let i = 0; i < dates.length; i++){
      const elem = dates[i];
        const requiredDateFormat: RequiredQuarterFormat = {
          startOfQuarter: elem,
          endOfQuarter: dates.length == i + 1 ? this.endDateOfCurrentYear() : this.getLastDayOfPreviousQuarter(dates[i + 1]),
          humanNameForQuarter: this.getHumanNameForQuarter(i)
        }
      arrOfHumanReadableDateForms.push(requiredDateFormat);
    }
    return arrOfHumanReadableDateForms;
  }

  
}
