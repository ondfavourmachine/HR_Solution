import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NecessaryModalMethods } from 'src/app/models/applicant-selection.models';
import { AGlobusBranch, BaseResponse, DepartmentsInGlobus } from 'src/app/models/generalModels';
import { InterviewTypes, SearchedApplicant, StaffName, ASchedule, CreateInviteDS, StageOfCreation } from 'src/app/models/scheduleModels';
import { SchedulerComponent } from 'src/app/pages/scheduler/scheduler.component';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.scss']
})
export class CreateScheduleComponent implements OnInit, NecessaryModalMethods {
  typeOfInvite: InterviewTypes = InterviewTypes.Test_Invite;
  departmentsInGlobus: DepartmentsInGlobus[] = [];
  interviewInvitees: Array<Partial<StaffName & SearchedApplicant>> = [];
  interviewers: Array<Partial<StaffName & SearchedApplicant>> = []
  selectedDept!: string;
  testLocations$!: Observable<BaseResponse<AGlobusBranch[]>>
  selectedTestLocation!: string;
  dateOfTest!: string;
  businessHours: string[] = ['07:00','08:00', '09:00', '10:00', '11:00', '12:00', '13:00' , '14:00', '15:00', '16:00'];
  preferredTimeForTest!: string;
  createSchedule: Partial<ASchedule> = {inviteType: 1, departmentId: 10, applicants: [], dateTime: '', branchId: 139, testInvigilators: []}
  selectedInviteType: InterviewTypes = InterviewTypes.Test_Invite;
  mainInterviewer!: StaffName | null;
  interviewTestLink!: string | null;
  description!: string;
  hospitalName!: string
  constructor(private dialogRef: MatDialogRef<SchedulerComponent>, public sharedService: SharedService) { }

  ngOnInit(): void {
    this.getDepartments();
    this.getTestLocations();
    
  }

  getTestLocations(){
    this.testLocations$ =  this.sharedService.getBranchesInGlobus();
  }

  showApplicantsSelected(event: {target: string, data: Array<Partial<StaffName & SearchedApplicant>>}){
    switch(event.target){
      case 'Invigilators':
      case 'Other Interviewers':
      case 'Other Interviewers (Optional)':
        this.interviewers = [...this.interviewers, ...event.data];
      break;
      case 'Panel Chair (Main Interviewer)':
        this.mainInterviewer = event.data[0] as StaffName;
      break;
      case 'Add Applicant':
      this.interviewInvitees = [...this.interviewInvitees, ...event.data];
      console.log(this.interviewInvitees);
      break;
      default:
       
    }
  }
  async getDepartments(){
    const { result: depts } = await this.sharedService.getDepartments();
    this.departmentsInGlobus = depts;
  }

  closeBtn(sendUp: boolean): void{
    if(sendUp){
      let response: CreateInviteDS = {
        interviewers: [...this.interviewers],
        interviewees: [...this.interviewInvitees],
        description: this.description,
        stageOfCreation: StageOfCreation.Initiation,
        interviewChairPerson: this.mainInterviewer as StaffName,
        location: (this.typeOfInvite == InterviewTypes.Test_Invite) || (this.typeOfInvite == InterviewTypes.Offer_Letter_Invite) ? this.selectedTestLocation.split('--')[0] : '',
        date: this.dateOfTest,
        branchId: (this.typeOfInvite == InterviewTypes.Test_Invite) || (this.typeOfInvite == InterviewTypes.Offer_Letter_Invite)  ? parseInt(this.selectedTestLocation.split('--')[1]) : 0,
        testTime: this.preferredTimeForTest,
        interviewTestLink: this.typeOfInvite == InterviewTypes.Test_Invite ? '': this.interviewTestLink as string, 
        interviewType: this.typeOfInvite,
    }
    this.hospitalName && this.hospitalName.length > 2 ? response = {...response, hospitalName: this.hospitalName} : null;
    this.typeOfInvite != (InterviewTypes.Medical_Invite || InterviewTypes.Offer_Letter_Invite) ?  response.dept = this.departmentsInGlobus.find(elem => elem.name == this.selectedDept)?.id : null,
    this.typeOfInvite != (InterviewTypes.Medical_Invite || InterviewTypes.Offer_Letter_Invite) ? response.departmentName = this.selectedDept : null
    this.dialogRef.close(response)
    return;
    }
    this.dialogRef.close()
  }

  removeInvitee(index: number, arrayToTarget: Array<Partial<StaffName & SearchedApplicant>>){
    arrayToTarget.splice(index, 1);
  }

  deleteMainInterviewer(){
    this.mainInterviewer = null;
  }

  handleToggling(event: Event){
    const val = (event.target as HTMLInputElement).value as InterviewTypes;
    this.selectedInviteType = val;
  }

}
