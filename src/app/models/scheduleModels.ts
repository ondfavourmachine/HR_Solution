import { BaseResponse } from "./generalModels"



export enum InterviewTypes {
    Application_Submitted= 'Application_Submitted_0', // this is not an interview type. I just put it there
    Test_Invite='Test_invites_1',
    Interview_Invite= 'Interview_invites_2',
    Interview_Invite_2= 'Interview_invites_3',
    Interview_Invite_3= 'Interview_invites_4',
    Medical_Invite='Medical_invites_5',
    Offer_Letter_Invite='Offer_letter_invites_6'
}

export enum InterviewTypesWithNumber {
  Application_Submitted= 0, // this is not an interview type. I just put it there
  Test_Invite= 1,
  Interview_Invite= 2,
  Medical_Invite= 3,
  Offer_Letter_Invite=4
}

export type SearchedApplicant =  {
    jobId: number,
    applicationRefNo: string,
    firstName: string,
    lastName: string,
    applicationStage: number,
    email: string,
    applicationStageName: null | string,
    position: string,
    courseofStudy: string
    isActive: boolean
  }


  export type ScheduleDay = {
    startOfBusinessHour: string,
    endOfBusinessHour: string,
    schedule: ASchedule | undefined,
    showScheduleBox: boolean
  }

  export type StaffName =  {
    mail: string,
    displayName: string
  }

  export type ASchedule = {
    schduleDateFormatForDisplay: string,
    description: string,
    id: number,
    inviteType: number,
    inviteTypeName?: string
    scheduleId: string,
    departmentId: number,
    departmentName?: string,
    department?: string
    jobTitle?: string
    stageOfCreation?: StageOfCreation,
    applicants: 
     Array <{
        email: string,
        applicatiionRef: string,
    
      } & Partial<SearchedApplicant>>
    dateTime: string,
    branchId: number,
    location: string,
    testInvigilators: Array<{name: string, email: string} & Partial<DBTypeOfInvigilator>>,
    testTime: {
      hour: number,
      minute: number
    },
    interviewTestLink: string,
    interviewChairPerson?: string,
    interviewers: 
      {
        displayName?: string
        id?: 0
        jobTitle?: string
        mail?: string
        scheduleRef?: string
        email: string,
        name?: string
      }[],
      status: string
    hospitalName: string,
    comment: string
  }

  export interface DBTypeOfInvigilator{
    displayName: string
    id: number
    jobTitle: string
    mail: string
    scheduleRef: string
  }

  export interface CreateInviteDS{
    interviewers: Array<Partial<StaffName & SearchedApplicant>>,
    interviewees: Array<Partial<StaffName & SearchedApplicant>>,
    dept: any,
    departmentName: string,
    interviewChairPerson?: StaffName | string | any,
    description: string
    date: string,
    branchId: number,
    location?: any,
    interviewTestLink?: string
    testTime: any,
    stageOfCreation: StageOfCreation
    interviewType: string,
    hospitalName?: string,
    comment?: string
  }

  export enum StageOfCreation{
    Initiation='Initiation',
    PendingApproval='PendingApproval',
    Approved='Approved'
  }

  export enum ScheduleApprovalNum{
    Pending=1,
    Approving,
    Rejecting

  }


  export interface GetScheduleResponse extends BaseResponse<ASchedule[]>{
    allInvite: number,
    test_Invite: number,
    interview_Invite: number,
    medical_Invite: number,
    offer_Letter_Invite: number,
    approved: number,
    pending: number,
    rejected: number,
  }

export type ScheduleSummaryTypes = 'allInvite' |  'test_Invite' | 'interview_Invite' | 'medical_Invite' |  'offer_Letter_Invite'
 export interface ScheduleSummaryStats {
      approved: number,
      rejected: number,
      pending: number,
      total: number
  }

  
