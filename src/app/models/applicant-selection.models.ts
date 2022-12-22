
import { AnApplication, ApplicationApprovalStatus, PreviewActions } from "./generalModels";

export interface ApplicantsSelectionResponse{
    accepted: number
    all: number
    awaiting: number
    data: Array<AnApplication>
    errors: null | string
    firstPage: string
    lastPage: string
    message: null | string
    nextPage:null | string
    pageNumber: number
    pageSize: number
    pending: number
    previousPage: null | string
    rejected: number
    returned: number
    statusCode: null | string
    succeeded: boolean
    totalPages: number
    totalRecords: number
  }

  export type ApplicantSelectionStatistics = Pick<ApplicantsSelectionResponse, 'accepted' | 'all' | 'awaiting' | 'rejected' | 'returned' | 'pending'>;

export interface SelectionMethods{
    getApplicantsForSelection() : void,
    handleApplicantsFromServer(val: ApplicantsSelectionResponse): void 
    gotoApplicantView(val: AnApplication): void,
    triggerApprovalModalForAcceptingApplicant(command: PreviewActions, acceptOrReject: ApplicationApprovalStatus): void,
    applicantAboutToBeAccepted: AnApplication,
    acceptAnApplicant(command: PreviewActions, comment: string): void,
    acceptingWasSuccessful():void
}

export interface NecessaryModalMethods{
  closeBtn(val?: any): void
}

export interface FullInterviewerDetailsAndInterviewResponse{
  id: number,
  applicationRefNo: string,
  mail: string,
  scheduleRef: string,
  displayName: string,
  jobTitle: string,
  authenticity: number,
  interviewerEmail: string,
  intergrity: number,
  focus: number,
  drive: number,
  intelligence: number,
  competence: number,
  communication: number,
  experience: number,
  performanceTrackRecord: number,
  interPersonalSkill: number,
  leadershipSkill: number,
  jobFit: number,
  totalScore: number,
  recommendation: null | string,
  comment: null | string
}