// import { ApplicantsSelectionResponse } from "./applicant-selection.models"/
import { FullInterviewerDetailsAndInterviewResponse } from "./applicant-selection.models"
import { InterviewTypesWithNumber } from "./scheduleModels"


export enum NYSCStrings {
    PROGRESS="InProgress",
    COMPLETED="Completed",
    EXEMPTED="Exempted"
}

export enum ClassOfDegree{
    FIRSTCLASS="First Class", 
    SECONDCLASSUPPER="Second Class Upper", 
    SECONDCLASSLOWER="Second Class Lower", 
    THIRDCLASS="Third Class", 
    PASS="Pass"
}

export enum JobType{
    EXECUTIVETRAINEE=1,
    EXPERIENCEDHIRE,
    COLLEGIAL
}

export enum JobStatus{
    PENDING=1,   
    APPROVE,
    REJECTED,
    REMOVED
}

export enum JobCategories{
    EXTERNAL = "External",
    INTERNAL = 'Internal'
}

export enum WhoIsViewing{
  EXTERNALCANDIDATE = "External_Candidate",
  INTERNALCANDIDATE = 'Internal_Candidate',
  OTHERPERSONS = 'Others',
}

export enum GRADES{
      GRADUATE="Graduate",
      TRAINEE="Trainee", 
      ABO="ABO", 
      BO='BO', 
      SBO="SBO", 
      AM="AM"
}

export enum Gender{
  Male = 'Male',
  Female = 'Female'
}

export enum MaritalStatus{
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced'
}

export enum FormTypesForJobApplication {
  PERSONALDATA = 1,
  EDUCATIONALRELATEDRECORDS,
  OTHERS
}

export interface BaseResponse<T = undefined>{
    hasError: boolean,
  message: string,
  statusCode: number | string,
  info: null | string,
  result: T,
  data?: T
}

export interface GeneralLookUp{
        id: number,
        name: string,
        description?: string
}

export interface DepartmentsInGlobus extends GeneralLookUp{
    hod: string
}

export type AUNITINGLOBUS = {
    unitId: number,
    name: string,
    departmentId: number,
    department: string
}


export interface AGlobusBranch {
    id: number,
    branchCode: string,
    branchName: string,
    branchAddress: string,
    regionalOffice: string,
    bankCode: string,
    routingNo: string,
    clearingBranchCode: string
  }


  export type UnitsInGlobus ={
    unitId: number,
      name: string,
      departmentId: number,
      department: null | string
  }
  export interface ApprovalRequestBody{
    jobId?: number,
    applicantId?: any,
    applicationStage: number,
    status: number,
    comment: string,
    isSpecial?: boolean,
    applicationRefNo: string
  }

  export enum ApplicationApprovalStatus{
    Pending=1,
    Approve,
    Rejected,
    Awaiting,
    Pass,
    Fail,
    Returned
  }


  export interface AuthResponse extends BaseResponse{
  email?: string
  token: string
  info: null | string,
  expiration: string,
  fullName: string
  message: string
  role: string

  }

  export interface GeneratedToken{
    description: "Token Generated Successfully"
    statusCode: "00"
    token: "22309768"
    userId: "okechukwundubisi@globusbank.com"
  }

  export type Role = {
      roleID: string,
      roleName: string
  }

  export interface StaffDetailsFromAd{
    stringType: string,
    stringId: null | string,
    deletionTimestamp: null | string,
    accountEnabled: null | string,
    city: null | string,
    companyName: null | string,
    country: null | string,
    createdDateTime: null | string,
    creationType: null | string,
    department: null | string,
    displayName: null | string,
    employeeId: null | string,
    givenName: null | string,
    immutableId: null | string,
    isCompromised: null | string,
    jobTitle: null | string,
    lastDirSyncTime: null | string,
    mail: null | string,
    mailNickname: null | string,
    mobile: null | string,
    postalCode: null | string,
    preferredLanguage: null | string,
    state: null | string,
    streetAddress: null | string,
    surname: null | string,
    telephoneNumber: null | string,
    usageLocation: null | string
  }

  export type WeekDayNameAndTheirCorrespondingNumber = {
    number: any,
    name: string,
    isCurrentDay: boolean
  }

  export type TestDetails ={
    testInfo: string,
    testDescription: string,
    testDate: string,
    testTime: string,
    testLocation: string
  }

  export type Views = 'jobs' | 'preview' | 'approve' | 'apply' | 'track application';
  export type tabs = 
  'Test Assessments' | 'Interview Assessments' |
  'Approved' | 'Pending' | 'All Invites' | 'Interview Invites' | 'Test Invites' | 'All Applications' | 'Tests' | 'Interview 01' | 'Interview 02' | 'Interview 03' | 'Medical' | 'Offer' | 'Post Acceptance';


 export type mimeTypes = 'jpg' | 'png' | 'jpeg' | 'doc' | 'docx' | 'pdf';
  export interface JobToBeCreated{
    objective: string,
    accountablities: string,
    position: string,
    department: number,
    unit: number,
    reportTo: string,
    supervises: string,
    location: number,
    deadline: string,
    grade: string,
    type: number,
    category: string,
    slot: number,
    status: string,
    isTestRequired: boolean,
    isInterviewRequired: boolean,
    classOfDegree: string,
    age: number,
    nysc: string,
    professionalCompetencies: string,
    behavioralCompetencies: string,
    organisationalCompetencies: string,
    personSpecification: string,
    educationalQualifications: string,
    experience: number,
    createdBy?: string
  }

  export type JobToBeCreatedKeys = keyof JobToBeCreated

  export interface AJob extends JobToBeCreated{
    createdBy: string, id: number, createdDate: string, slot: number,yearOfExperience: number, departmentName: string, locationName: string, typeName: string,
  }

  export type otherRelevantData = {
    category: JobCategories,
    whoIsViewing: WhoIsViewing
  }
  export enum InvitationStatus {
      Sent='Sent',
      NotSent='Not Sent'
  }

  export type JobAppliedForByApplicant = RequiredApplicantDetails & AnApplication;

  export interface RequiredApplicantDetails {
    jobId: number,
    applicationRefNo: string,
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    dob: string,
    age: number,
    overallScore?: any
    phone: string,
    secondaryPhone: string,
    gender: string,
    maritalStatus: string,
    state: number,
    stateName: string,
    residentialAddress: string,
    universityBSc: string,
    degree: string,
    isMailSent: boolean
    classOfDegree: string,
    courseofStudy: string,
    universityMSc: string,
    courseMsc: string,
    completedNYSC: boolean | NYSCStrings,
    yearOfCompletion: string,
    yearsOfExperience: number,
    currentEmployer: string,
    cv?: File,
    passport?: File,
    certification: any,
    cV_URL: string,
    passport_URL: string,
    qualification?: string
    position?: string
    certification_URL: string
    actorName: null
    applicationId: number
    applicationStage: number
    approverComment: string
    approverStatus: string
    audit_Comment: string
    audit_Status:string
    authenticity: number
    comment: null | string
    communication: number
    competence: number
    currentPosition: null | string
    currentRenumeration:number
    dateApplied: string
    dateTime: string
    drive: number
    experience: number
    financialExpectation: number
    focus: number
    hR_Admin: string
    hR_Comment: string
    hR_Status : string
    hospitalName: null | string
    indebtness: null | string
    intelligence: number
    interPersonalSkill: number
    intergrity: number
    interviewerEmail: null | string
    interviewerName: null |string
    interviewerPosition: null | string
    invitationStatus?: InvitationStatus
    jobCategory: null | string
    jobFit: number
    leadershipSkill: number
    location: null | string
    noticePeriod: null | string
    performanceTrackRecord: number
    pickUpBranch: null | string
    pickUpLocation: null | string
    reasonLeaving: null | string
    recommendation: null | string
    residential_State: null | string
    roleName: null | string
    scheduleApproved: null | string
    scheduleId: null | string
    score: number
    testAssessed: number
    totalScore: number
    isActive: boolean,
    offerAcceptance: ApprovalProcessStatuses
    offerRole: null | string,
    oLeverl: string
    oLeverlUrl: string
    passportUrl: string,
    degreeUrl: string,
    nyscUrl: string,
    nameChangeUrl: string
    marriageUrl: string
  }

  export interface AnApplication extends RequiredApplicantDetails {
    jobTitle: string,
    dateApplied: string,
    applicationStatus: string,
    applicationStage: number
    applicationStageName: string,
    acceptanceDocument: string,
    approverComment: string
    approverStatus: string,
    auditApproval?: ApprovalProcessStatuses
    assessmentStatus?: boolean,
    scoreSheet_URL?: null | string,
    chairPersonInfo: ChairPersonInformation
    overallScore?: number,
    scheduleStatus: string
    testScore?: string | number,
    raters?: Array<{id: number, email: string}>
    applicationId: number,
    scheduleRef?: string
    invitationStatus?: InvitationStatus,
    infoStatus?: string
    status: ApprovalProcessStatuses
    interviewInfoId: number,
    chairPersonAssessed: boolean,
    interviewAssessed: number,
    interviewerStatus: string,
    applicantEmail: null | string,
    applyPosition:null | string,
    departmentId: number,
    schedulerDept: null | string,
    branchName: null | string,
    branchAddress: null | string,
    category: null | string,
    interviewersSummary: Array<Partial<FullInterviewerDetailsAndInterviewResponse>>
  }

  export interface ChairPersonInformation{
    id: number,
    applicationRef: string,
    scheduleId: null | string,
    cummulativeYearOfExperience: number,
    currentPosition: number,
    noticePeriod: string,
    indebtness: number,
    reasonForLeaving: string,
    financialExpectation: number,
    currentRenumeration: number
  }

  export type CandidateFiles =  Partial<Pick<RequiredApplicantDetails, 'cv'|'passport' | 'certification'>>;

  export enum PreviewActions {
    CLOSEANDEDIT=1,
    CLOSEANDSUBMIT,
    CLOSEANDDONOTHING,
    
  }


  export enum ApprovalProcessStatuses{
    Pending='Pending',
    Awaiting='Awaiting',
    Approve='Approve',
    Rejected='Rejected',
    Returned='Returned',
    Pass='Pass',
    Fail='Fail'
  }

  export type RequiredQuarterFormat = {startOfQuarter: Date, endOfQuarter: Date, humanNameForQuarter: string};

  export interface SearchParams{
    State: string,
    JobTitle: string,
    JobCategory: string,
    ClassOfDegree: string,
    Age: string,
    Quarter: string,
    ApplicationStage: InterviewTypesWithNumber,
    ApplicantName: string,
    StartDate: string,
    EndDate: string,
    PageNumber: string,
    PageSize: string,
  }

  

  

  export type ObsCallBack = (page: any, pageLimit: number) => void;

  export type PaginationMap = Map<number, Array<any>>

  export type paginationOptions = {updatePaginationData: boolean, currentPageToSet: number}

  export type MakeAnApplicationSelectionCall = (ApplicationStage?: number, pageNumber?: number, noOfRecord?: number) => void

  export interface Pagination{
    paginationData: PaginationMap,
    page: number,
    pageLimit: number,
    endNumber: number,
    currentPageSet: Array<number>,
    nextPageSelection: number,
    prevPageSelection: number,
    numberOfPages: number | undefined,
    arrayOfPagesSet: Array<number[]>,
    startDate: Date | string | number,
    endDate: Date | string | number,
    selectAnotherPage (page: any, obsCallBack: ObsCallBack, paginationOptions?: paginationOptions) : void,
    generatePagesForView(): void,
    generateStartDate(date?: Date): string,
    generateEndDate(date?: Date): string,
    clearPaginationStuff(): void,
    loadNextSetOfPages<T>(
      ParametersForCallingApplicationSelection: {ApplicationStage: number, noOfRecord: number}, 
      callBack: MakeAnApplicationSelectionCall): T[] | void
    loadPreviousSetOfPages<T>(ParametersForCallingApplicationSelection: {ApplicationStage: number, noOfRecord: number}, 
      callBack: MakeAnApplicationSelectionCall): T[] | void
    calculatePagination<T>(data: T[], totalPage: number): void
  }

  export interface PaginationMethodsForSelectionAndAssessments{
    loadNextSetOfPages<T>(): T[] | void
    loadPreviousSetOfPages<T>(): T[] | void
    fetchRequiredNoOfRecords(): void
    selectAPageAndInformation(pageNumber: number): void 
  }

  // export abstract class PreviewComponentResponse{
  //    gotoApplicantView<T>(applicant: T):void {}
  // }

  export interface InformationForModal<T>{ 
    applicantData: T, 
    extraInfo?: {applicantSelectionScreen: boolean, callBack: Function, extras?: any, interviewForm: boolean} 
  }

  export interface InformationForApprovalModal<S, B, F = any>{
    header?: S,
    button: B,
    message?: S,
    shouldShowIsSpecialToggle?: boolean,
    callBack?: F 
  }

  export interface PaginationFromBE{
    pageNumber: number,
    pageSize: number,
    firstPage: string,
    lastPage: string,
    totalPages: number,
    totalRecords: number,
    nextPage: null | string,
    previousPage: null | string,
    statusCode: null |string,
  }

  export interface PostAcceptanceInfo{
    applicationRefNo: string
    referenceName: string
    referencePhone: string
    referenceEmail: string
    referenceAddress: string
    taxId?:string
    nhfno?: string
    pensionNo?: string
    pensionProvider?: string
    passport: string | File
    olevel: string | File
    degree: string | File
    nysc: string | File
    marriage: string | File
    masters: string | File
    certificate?: string | File
    nameChange?: string | File
  }

  