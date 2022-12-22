import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { FormTypesForJobApplication, tabs, WeekDayNameAndTheirCorrespondingNumber } from 'src/app/models/generalModels';
import { ASchedule, CreateInviteDS, ScheduleDay, ScheduleSummaryStats, ScheduleSummaryTypes, StageOfCreation } from 'src/app/models/scheduleModels';
import { ScheduleSwitching } from 'src/app/modules/schedule-master/base-schedule-switcher';
import { CreateScheduleComponent } from 'src/app/modules/schedule-master/create-schedule/create-schedule.component';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';
import { convertDateAndTimeToScheduleFormat } from 'src/app/services/small_reusable_functions';
// import { SuccessfulInitiationComponent } from 'src/app/shared/successful-initiation/successful-initiation.component';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent extends ScheduleSwitching implements OnInit {
 dayHeaderNames: WeekDayNameAndTheirCorrespondingNumber[] = [];
 businessHours: string[] = ['07:00','08:00', '09:00', '10:00', '11:00', '12:00', '13:00' , '14:00', '15:00', '16:00'];
 daysOfCurrentWeek: Date[] = []
 businessDates: ScheduleDay[] = [];
 calendarMonths: string[] = [];
 currentMonth = this.sdm.getCurrentMonth();
 tabList: tabs[] = ['All Invites', 'Test Invites', 'Interview Invites', 'Medical', 'Offer', 'Post Acceptance'];
 role!: string
 storeOfSummaries: Record<ScheduleSummaryTypes, Partial<ScheduleSummaryStats>> = {
    allInvite: {},
    test_Invite: {},
    interview_Invite: {},
    medical_Invite: {},
    offer_Letter_Invite: {}
 }
  constructor(
    private sharedService: SharedService,
    public override dialog: MatDialog,
    private scheduleService: ScheduleService,
    private sdm: SchedulerDateManipulationService
  ) { 
    // another way to have multiple components receive feedback notifications from a material modal
   // by having one central base class that all children classes extend and then have access to the notification 
   // i didnt explain it properly though.
   // this method seems cleaner to me 
    super(dialog);
    this.fetchSchedules = this.fetchSchedules.bind(this);
    this.getMatrixOfScheduler = this.getMatrixOfScheduler.bind(this);
  }

  ngOnInit(): void {
    this.getDaysOfCurrentWeek();
    this.setUpDaysOfWeekAsHeadersOfScheduler(this.daysOfCurrentWeek);
    this.getMatrixOfScheduler();
    this.fillUpCalendarMonths();  
    this.role = this.sharedService.getRole();
  }

  handleChangeOfTab(event: string){}

  triggerAdditionOfSchedule(){
    if(this.role == 'Approver') return;
    const config: MatDialogConfig = {
      panelClass: 'create_a_schedule',
      width: '75vw',
      height: '75vh',
    }
    const dialogRef = this.dialog.open(CreateScheduleComponent, config);
    dialogRef.afterClosed().subscribe((val: CreateInviteDS) => {
       if(val){
        const hour = (val.testTime as string).split(':')[0] == '10' ? 
          (val.testTime as string).split(':')[0] : (val.testTime as string).split(':')[0].startsWith('0') ? (val.testTime as string).split(':')[0].slice(1) : (val.testTime as string).split(':')[0];
       const interviewType = val.interviewType.split('_')[2];
        let scheduleToCreate: Partial<ASchedule> = {
        interviewChairPerson: typeof val.interviewChairPerson == 'object' ? val.interviewChairPerson!.mail as string : '',
        schduleDateFormatForDisplay: convertDateAndTimeToScheduleFormat(val.date, val.testTime),
        testInvigilators: parseInt(interviewType) == 1 ?  val.interviewers.map(interviewer => ({email: interviewer.mail as string, name: interviewer.displayName as string})) : [],
        branchId : val.branchId,
        description: val.description,
        applicants: val.interviewees.map(applicant => ({
          firstName: applicant.firstName, lastName: applicant.lastName,
          email: applicant.email as string, applicatiionRef: applicant.applicationRefNo as string, courseofStudy: applicant.courseofStudy, position: applicant.position})),
        departmentId: val.dept,
        departmentName: val.departmentName,
        stageOfCreation: val.stageOfCreation,
        location: val.location,
        interviewers: parseInt(interviewType) >= 2  ? val.interviewers.map(interviewer => ({email: interviewer.mail as string, name: interviewer.displayName as string})): [],
        inviteTypeName: val.interviewType,
        inviteType: parseInt(interviewType),
        dateTime: val.date,
        testTime: {hour: parseInt(hour), minute: 0}
      }
      val.hasOwnProperty('hospitalName') && val!.hospitalName!.length > 2 ? scheduleToCreate = {...scheduleToCreate, hospitalName: val.hospitalName} : null;
      const d =  super.receiveResponseFromModal(scheduleToCreate);
      d.afterClosed().subscribe((val: Partial<ASchedule>) => this.showSuccessModalAndFetchData(val));

    
      // this.insertCreatedScheduleIntoView(scheduleToCreate.schduleDateFormatForDisplay as string)
       }
    })
    
  }

  showSuccessModalAndFetchData(scheduleToCreate: Partial<ASchedule>){
    this.sharedService.triggerSuccessfulInitiationModal(`${scheduleToCreate.inviteType == 1 ? 'You have initiated Test'  : scheduleToCreate.inviteType == 5 ? 'You have initiated Medical' :  scheduleToCreate.inviteType == 6 ? 'You have initiated Offer Letter' : 'You have initiated Interview' } Invite for 
      ${scheduleToCreate.dateTime} at ${scheduleToCreate.testTime?.hour}:00 hours
      You will be notified when it's been treated by the approver`, 'Continue', this.getMatrixOfScheduler)
  }

  triggerSuccessModal(event: Partial<ASchedule>){
    // debugger;
    // this is the reason why approval of schedule doesn't trigger reload. Please fix it ASAP!!
    if(event && event.stageOfCreation == StageOfCreation.Approved){
    this.sharedService.triggerSuccessfulInitiationModal(
    `You have successfully approved ${event.inviteType == 1 ? 'Test'  : event.inviteType == 5 ? 'Medical' :  event.inviteType == 6 ? 'Offer Letter' : 'Interview' } Invite
    ${event.dateTime?.includes('T') ? event.dateTime.split('T')[0] : event.dateTime} at ${event.testTime?.hour ?? event.dateTime!.split('T')[1]}:00 hours`, 'Continue', this.getMatrixOfScheduler)
    }
  }

  // insertCreatedScheduleIntoView(schduleDateFormatForDisplay: string){
  //  const element = document.getElementById(schduleDateFormatForDisplay);
  //  console.log(element);
  // }
  setUpDaysOfWeekAsHeadersOfScheduler(daysOfCurrentWeek: Date[]){
    const dayNamesForHeader = this.sdm.getDayNames(daysOfCurrentWeek);
    this.dayHeaderNames = dayNamesForHeader.map((elem, index) => {
      const [ nameOfDate,numberOfDate] = elem.split(' ');
      return {
        number: numberOfDate.replace(/,/g, ''),
        name: nameOfDate.replace(/,/g, ''),
        isCurrentDay: this.sdm.checkIfDayIsCurrentDay(daysOfCurrentWeek[index])
      }
    })
  }

  getDaysOfCurrentWeek(){
    this.daysOfCurrentWeek = this.sdm.getDaysOfCurrentWeek().filter(this.sdm.dateIsAWeekDay);
  }

  showNextWeekDays(){
    this.daysOfCurrentWeek = this.sdm.getNextWeekDays().filter(this.sdm.dateIsAWeekDay);
    this.setUpDaysOfWeekAsHeadersOfScheduler(this.daysOfCurrentWeek);
    const aMonth = this.daysOfCurrentWeek.map(elem => this.sdm.getMonthInHumanReadableFormat(elem));
    aMonth.every(elem => elem == this.currentMonth) ? null : this.currentMonth = this.calendarMonths[this.calendarMonths.indexOf(`${aMonth[0]} ${this.sdm.getCurrentYear()}`)];
    this.getMatrixOfScheduler();
  }

  showPrevWeekDays(){
    this.daysOfCurrentWeek = this.sdm.getPrevWeekDays().filter(this.sdm.dateIsAWeekDay);
    this.setUpDaysOfWeekAsHeadersOfScheduler(this.daysOfCurrentWeek);
    const aMonth = this.daysOfCurrentWeek.map(elem => this.sdm.getMonthInHumanReadableFormat(elem));
    aMonth.every(elem => elem == this.currentMonth) ? null : this.currentMonth = `${aMonth[0]} ${this.sdm.getCurrentYear()}`;
    this.getMatrixOfScheduler();
  }

  getMatrixOfScheduler(){
    const matrix: string[] = [];
    this.businessHours.forEach(hour => {
      this.daysOfCurrentWeek.forEach(day => {
        const dayInPreferredformat = day.getDate() > 9 ? `${day.getDate()}` : `0${day.getDate()}`
        const id = `${hour}--${day.getFullYear()}--${day.getMonth() + 1}--${dayInPreferredformat}`;
        matrix.push(id);
      })
    })
    // this.businessDates
    let matrixWithoutDates =  this.businessDates = matrix.filter(elem => elem.split('--')[0] != '07:00')
    .map(elem => ({startOfBusinessHour: elem, schedule: undefined, showScheduleBox: false, endOfBusinessHour: this.getEndOfBusinessHour(elem)}));
    this.fetchSchedules(matrixWithoutDates);
    // convert the matrix from an array of string to an {date: string, schdule: array}[]
    // write a trackBy function
    // now write function to pick all dates with schedule and then insert them into the matrix array
    // the trackByfunction will help angular to optimize rerender of the matrix array since it has changed.

  }

  getEndOfBusinessHour(dateTime: string){
    const [time, year, month, day] = dateTime.split('--');
    const reformedTime = time.split(':')[0] == '10' ? time.split(':')[0] : time.split(':')[0].startsWith('0') ? time.split(':')[0].slice(1) : time.split(':')[0];
    const endHourInNumberForm = parseInt(reformedTime) + 1;
    const formatedNumber = new Intl.NumberFormat("en", {minimumIntegerDigits: 2}).format(endHourInNumberForm)
    return `${formatedNumber}:00--${year}--${month}--${day}`;
  }

  fillUpCalendarMonths(){
    this.calendarMonths = this.sdm.getMonthsOfYear().map(elem => `${elem} ${this.sdm.getCurrentYear()}`)
  }

  trackByDate(index: number, schdule: ScheduleDay){
    return schdule.startOfBusinessHour;
  }

  async fetchSchedules(matrixOfDate: ScheduleDay[]){
    //s means start, e means end
    const firstDateInArray  = matrixOfDate[0];
    const secondDayInArray = matrixOfDate[matrixOfDate.length -1];
    const [s_, sYear, sMonth, sDay] = firstDateInArray.startOfBusinessHour.split('--');
    const [e_, eYear, eMonth, eDay] = secondDayInArray.startOfBusinessHour.split('--');
   try {
    const {result, rejected, approved, pending, allInvite, test_Invite, interview_Invite, medical_Invite, offer_Letter_Invite} = await lastValueFrom(this.scheduleService.getSchedules(`${sYear}-${sMonth}-${sDay}`, `${eYear}-${eMonth}-${eDay}`));
    this.storeOfSummaries.allInvite = {approved, total: allInvite, pending, rejected};
    this.storeOfSummaries.test_Invite = {approved, total: test_Invite, pending, rejected};
    this.storeOfSummaries.interview_Invite = {approved, total: interview_Invite, pending, rejected};
    this.storeOfSummaries.medical_Invite = {approved, total: medical_Invite, pending, rejected};
    this.storeOfSummaries.offer_Letter_Invite = {approved, total: offer_Letter_Invite, pending, rejected}
    if(result){
      result.forEach(elem => {
        const {dateTime} = elem;
        const [date, time] = dateTime.split('T');
        let modifiedTime = time.split(':').slice(0,2).join(':');
        const timeConvertedToScheduleFormat = convertDateAndTimeToScheduleFormat(date, modifiedTime);
        // console.log(timeConvertedToScheduleFormat);
        const actual = matrixOfDate.find(schedule => schedule.startOfBusinessHour == timeConvertedToScheduleFormat);
        const targetBusinessHourBox = matrixOfDate.find(schedule => schedule.startOfBusinessHour == actual?.endOfBusinessHour );
        targetBusinessHourBox!.schedule = elem;
        targetBusinessHourBox!.showScheduleBox = true;
       })
    }
    return;
   } catch (error) {
    console.log(error);
    this.sharedService.errorSnackBar('An error occurred. Please try again later.');
   }
   
  }


  unitTrigger(event: Event){
    const pinpoint = event.target as HTMLDivElement;
    const parentContainer = pinpoint.closest('.grid_box_for_schedule');
    const bodySchedule = parentContainer?.querySelector('.body_of_schedule');
    if(!bodySchedule)this.triggerAdditionOfSchedule();
  }

}
