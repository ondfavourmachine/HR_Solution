export const environment = {
  production: true,
  externalCandidateBaseUrl: 'http://10.22.22.32:8888/api/',
  baseUrl: 'http://10.22.22.32:8056/api/',

  authUrl:{
    login: 'Authenticate/Login'
  },

  externalApplicationApis: {
    applyForJob: 'Application/AddApplication',
    updateApplicantApplication: 'Application/Upload',
    applicantJobs: 'Application/GetApplicantJobs',
    getTestDetails:'Application/GetApplicantTestDetailByEmail' ,
    getOfferLetterDetails: 'Application/GetApplicantOfferDetailByEmail',
    acceptOrRejectOffer: 'ApplicantOfferLetter/AddOfferLetter',
    addReferences: 'PostAcceptanceDetails/AddApplication',
    addDocumentsForAcceptance: 'PostAcceptanceDetails/Upload'
  },

  schedule:{
    createASchedule: 'Scheduler/AddSchedule',
    getSchedules: 'Scheduler/GetSchedulesByDate',
    approveSchedule: 'Scheduler/ApproveSchedule',
    getOneScheduleByScheduleRef: 'Scheduler/GetScheduleByScheduleAndApplicationRef'
  },

  jobApis: {
    creatJob: 'JobCreate/AddJob',
    getPendingJobs: 'JobCreate/GetJobsByStatus',
    approveJob: 'JobCreate/ApproveJob',
    getAJob: 'JobCreate/GetJobById',
    getJobByCategory: 'JobCreate/GetJobs',
    createDraft: 'JobDraft/AddJobDraft',
    getDraft: 'JobDraft/GetDrafts',
    deleteDrafts: 'JobDraft/DeactivateJobDraft',
    internalCandidateJobApplication: 'Application/AddApplication',
    internalCandidateJobApplicationUpload: 'Application/Upload',
    getJobOfAnInternalCandidate: 'Application/GetApplicantJobByJobId',
    deactivate: 'JobCreate/DeactivateJob'
  },
  departments: {
    getDept: 'Department/GetDepartments'
  },
  units: {
    getUnitsInBank: 'Unit/GetUnits',
    getUnitsByDept: 'Unit/GetUnitsByDepartment'
  },

  applicationSelection: {
    getApplication: 'Application/ApplicantSelection',
    approveAnApplication: 'Application/ApproveApplication',
    searchApplicantsDueSchedule: 'Application/ApplicantDueSchedule',
    searchStaffByDept: 'Staff/GetStaffsByDepartment',
  },
  assessment: {
    getAssessments: 'Assessment/AssessmentSelection',
    uploadATestScore: 'Scheduler/UploadTest',
    addApplicationTest: 'ApplicantTest/AddApplicantTest',
    approveTestScore: 'Application/ApproveApplication',
    addInterviewChairDetailsForAnInterview: 'ApplicantInterviewInfo/AddApplicantInterviewInfo',
    addInterviewerRatingsForAnApplicant: 'InterviewerSummary/AddInterviewerSummary',
    calculateScore: 'InterviewerSummary/GetAverageScore',
    getGradesByAnInterviewer: 'InterviewerSummary/InterviewerPerformanceSummary',
    getTestBatches: 'Scheduler/GetBatchApplicantsScheduled',
    getApplicantsInOneBatch: 'Assessment/TestAssessmentByScheduleRef'
  },
  branches:{
    branchesInGlobus: 'Branch/GetBranches'
  },
  lookUps: {
    getStates: 'State/GetStates',
    getUniversitiesInNigeria: 'Miscellaneous/GetUniversities',
    getDegrees: 'Miscellaneous/GetDegrees'
  }
};
