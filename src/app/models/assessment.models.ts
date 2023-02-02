import {AnApplication, ApprovalProcessStatuses, JobCategories, PaginationFromBE, RequiredApplicantDetails } from "./generalModels";
import { DBTypeOfInvigilator, InterviewTypes, InterviewTypesWithNumber } from "./scheduleModels";


export type AssessmentResponseDS<T> = PaginationFromBE & StatusOfAssessment & {
    data: T
}

export interface BatchedSchedule{
  scheduleRef:	string
  applicationRef:	null | string
  createdDate: string
  testDate: string
  invigilator	: string
  scoreSheet: string
  applicants: number
  scoreUploaded: string
  assessmentStatus:	string,
  auditApproval: string
}


export interface StatusOfAssessment{
    all: number,
    pending: number,
    accepted: number,
    rejected: number,
    awaiting: number,
    returned: number,
  }

  export interface AnAssessment{
      applicantName: string,
      position: string,
      invigilator: string,
      score: null | string,
      roleName: null | string,
      status: null | string,
      assessmentStatus: boolean,
      auditApproval: ApprovalProcessStatuses,
      branchId: number,
      category: JobCategories,
      scheduleId: string,
      applicationRefNo: string,
      applicationStage: number,
      dateTime: string,
      scoreSheet_URL: null | string
      applicationId?: number
      hospitalName?:null | string
      hrApproval?: ApprovalProcessStatuses

  }

  export interface AssessmentDetails{
    applicants: Partial<AnApplication>[]
    applicationRefNo: null | string
    branchId: number
    category: null | string
    comment: null | string
    dateTime: string
    departmentId: number
    scheduleStatus: string
    departmentName: string
    description: null | string
    hospitalName: null | string
    id: number
    interviewChairPerson: null | string
    interviewTestLink: null | string
    interviewers:   DBTypeOfInvigilator[]
    inviteType: InterviewTypesWithNumber
    inviteTypeName: string
    isInterviewDone: null | string
    jobId: number
    jobTitle:null | string
    location: string
    scheduleId: string
    testInvigilators: DBTypeOfInvigilator[]
    testTime: null | string

  }

  export type InformationForApprovingAnAssessment = {typeOfAssessment: InterviewTypesWithNumber, buttonText?: string, headingText?: string}

  export type RequiredDetailsFromInterviewChair={
    id: number,
    applicationRef: string,
    scheduleId: string,
    cummulativeYearOfExperience: number,
    currentPosition: string,
    noticePeriod: string,
    indebtness: number | string,
    reasonForLeaving: string,
    expectation_Level: string,
    overallScore: number,
    scoreSheet: string,
    hR_Status: string,
    comment: string,
    financialExpectation: number | string,
    currentRenumeration: number | string
  }

  export interface RatingsInformationOnAnApplicant{
    applicationRefNo: any,
    schduleRef: any,
    applicantInterviewInfoID: number | string,
    authenticity: number  | string,
    interviewerEmail: string,
    intergrity: number | string,
    focus: number | string,
    drive: number | string,
    intelligence: number | string,
    competence: number | string,
    communication: number | string,
    experience: number | string,
    performanceTrackRecord: number | string,
    interPersonalSkill: number | string,
    leadershipSkill: number | string,
    jobFit: number | string,
    totalScore: number | string,
    recommendation: string,
    comment: string
  }