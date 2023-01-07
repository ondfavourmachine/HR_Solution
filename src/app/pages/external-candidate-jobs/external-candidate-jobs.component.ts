import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable , lastValueFrom, Subscription } from 'rxjs';
import { AJob,GeneralLookUp,otherRelevantData, Gender, MaritalStatus, RequiredApplicantDetails, FormTypesForJobApplication, Views, WhoIsViewing, NYSCStrings, CandidateFiles, PreviewActions } from 'src/app/models/generalModels';
import { ExternalApplicantService } from 'src/app/services/external-applicant.service';
import { JobsService } from 'src/app/services/jobs.service';
import { LookUpService } from 'src/app/services/look-up.service';
import { SharedService } from 'src/app/services/sharedServices';
import { PreviewApplicationComponent } from '../preview-application/preview-application.component';
const calcAgeFromDob = (val: string) => new Date(Date.now()).getFullYear() - parseInt(val.split('-')[0]);

@Component({
  selector: 'app-external-candidate-jobs',
  templateUrl: './external-candidate-jobs.component.html',
  styleUrls: ['./external-candidate-jobs.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalCandidateJobsComponent implements OnInit, AfterViewInit {
  @ViewChild('PassportInsertionPoint') PassportInsertionPoint!: ElementRef<HTMLElement>;
  @ViewChild('CVInsertionPoint') CVInsertionPoint!: ElementRef<HTMLElement>;
  @ViewChild('PersonSpecificationsThree') PersonSpecificationsThree!: ElementRef<HTMLElement>;
  @ViewChild('ProfessionalCompetenciesThree') ProfessionalCompetenciesThree!: ElementRef<HTMLElement>;
  @ViewChild('AccountabilityThree') AccountabilityThree!: ElementRef<HTMLElement>;
  @ViewChild('JobObjectivesThree') JobObjectivesThree!: ElementRef<HTMLElement>;
  @ViewChild('BehavioralCompetenciesThree') BehavioralCompetenciesThree!:ElementRef<HTMLElement>;
  @ViewChild('OrganisationalCompetenciesThree') OrganisationalCompetenciesThree!: ElementRef<HTMLElement>;
  @ViewChild('EducationalQualificationsThree') EducationalQualificationsThree!: ElementRef<HTMLElement>;
  @ViewChild('ExperienceThree') ExperienceThree!: ElementRef<HTMLElement>;
  @ViewChild('FormPreviewButton') FormPreviewButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('AsidePreviewButton') AsidePreviewButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('ForeignUniversities', {static: false}) ForeignUniversities!: ElementRef<HTMLDivElement>;
  @ViewChild('LocalUniversities', {static: false}) LocalUniversities!: ElementRef<HTMLDivElement>;
  relevantData!: otherRelevantData;
  approvedJobs: AJob[] = [];
  views: Views = 'jobs';
  subView: Extract<Views, 'preview' | 'apply'> = 'preview';
  applicationView: number = 1;
  applicationViewName: 'Personal' | 'Education' | 'Experience' = 'Personal';
  dataFromCreateJob: any = {};
  currentBranchInView!: any
  personalDataForm!: FormRecord<FormControl<string | null>>;
  educationRelatedRecords!: FormRecord<FormControl<string | null>>;
  extraInformation!: FormGroup;
  states: GeneralLookUp[] = [];
  nigerianUniversities: GeneralLookUp[] = [];
  degrees: GeneralLookUp[] = [];
  acceptedYearsOfNYSCCompletion: number[] = this.acceptedYearsOfCompletion();
  fileStorage: CandidateFiles = {};
  subscriptionsToClear: (Subscription | undefined)[] = []
  
  constructor(private activatedRoute: ActivatedRoute,
     public sharedService: SharedService,
     private externalCandidatesService: ExternalApplicantService,
     private lookUpService: LookUpService,
     private jobservice: JobsService,
     private dialog: MatDialog,
     private fb: FormBuilder) { 
      // this.showAnInputForEnteringForeignUniversities = this.showAnInputForEnteringForeignUniversities.bind(this)
     }

  ngOnInit(): void {
    const {category} =this.activatedRoute.snapshot.params;
    this.relevantData = {category, whoIsViewing: WhoIsViewing.EXTERNALCANDIDATE};
    this.personalDataForm = this.getFormGroup(FormTypesForJobApplication.PERSONALDATA) as FormRecord<FormControl<string | null>>;
    this.educationRelatedRecords = this.getFormGroup(FormTypesForJobApplication.EDUCATIONALRELATEDRECORDS) as FormRecord<FormControl<string | null>>;
    this.extraInformation = this.getFormGroup(FormTypesForJobApplication.OTHERS)
    this.getApprovedJobs();
    this.fetchLookups();
    this.acceptedYearsOfCompletion();
    this.subscriptionsToClear[0] = this.dob?.valueChanges.subscribe({next: (val) => this.age?.patchValue(calcAgeFromDob(val))});
  }

   showAnInputForEnteringForeignUniversities(val: string){
    if(!isNaN(parseInt(val))){
       this.LocalUniversities.nativeElement.classList.add('hide_field');
       this.ForeignUniversities.nativeElement.classList.remove('hide_field');
    }
   }

   removeForeignUniversity(){
     this.LocalUniversities.nativeElement.classList.remove('hide_field');
     this.ForeignUniversities.nativeElement.classList.add('hide_field');
   }

   ngAfterViewInit(): void {
    this.subscriptionsToClear[1] = this.university?.valueChanges.subscribe({next: (val) => this.showAnInputForEnteringForeignUniversities.bind(this)(val)});
   }

   fetchLookups(){
    forkJoin({
      getStates: this.lookUpService.getStates(),
      getUniversities: this.lookUpService.getUniversities(),
      getDegrees: this.lookUpService.getDegrees()
    })
    .subscribe(
      {
        next: ({getStates, getUniversities, getDegrees}) => {
          const {result: stateResult} = getStates;
          const {result: universityResult} = getUniversities;
          const {result: degreeResult} = getDegrees;
          this.states = stateResult;
          this.nigerianUniversities = universityResult;
          this.degrees = degreeResult;
        },
        error: console.error
      },
    )
   }

   getFormGroup(typeOfForm: FormTypesForJobApplication): FormRecord<FormControl<string | null>> | FormGroup{
    switch(typeOfForm){
      case FormTypesForJobApplication.PERSONALDATA: {
        return this.fb.record({
          firstName: ['', [Validators.required, Validators.minLength(3)]],
          lastName: ['', [Validators.required, Validators.minLength(3)]],
          middleName: [''],
          email: ['', [Validators.required, Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
          dob: ['', Validators.required],
          age: ['', Validators.required],
          phone: ['', [Validators.required, Validators.pattern(/(080|070|090|091|081)\d{8}/)]],
          secondaryPhone: [''],
          gender: [Gender.Male, Validators.required],
          maritalStatus: [MaritalStatus.Single, Validators.required],
          state: ['', Validators.required],
          residentialAddress: ['', [Validators.required, Validators.minLength(3)]]
        })
      }
      case FormTypesForJobApplication.EDUCATIONALRELATEDRECORDS: {
        return this.fb.record({
          universityBSc: ['', Validators.required],
          degree: ['', Validators.required],
          classOfDegree: ['', Validators.required],
          courseofStudy: ['', Validators.required],
          universityMSc: [''],
          courseMsc: [''],
          completedNYSC: [NYSCStrings.COMPLETED, Validators.required],
          yearOfCompletion: ['']

        })
      }
       case FormTypesForJobApplication.OTHERS: {
        return this.fb.group({
          certification: this.fb.array([]),
          currentEmployer: [''],
          yearsOfExperience: ['']
        })
      }
    }
    
   }
  // getters for personalDataForm

  get certificates(): FormArray | any{
    return this.extraInformation.controls['certification'] as FormArray;
  }

  get firstName(): AbstractControl | null{
    return this.personalDataForm.get('firstName');
  }

  get lastName(): AbstractControl | null{
    return this.personalDataForm.get('lastName');
  }

  get email(): AbstractControl | null{
    return this.personalDataForm.get('email');
  }

  get dob(): AbstractControl | null{
    return this.personalDataForm.get('dob');
  }

  get age(): AbstractControl | null{
    return this.personalDataForm.get('age');
  }

  get phone(): AbstractControl | null{
    return this.personalDataForm.get('phone');
  }

  get secondaryPhone( ): AbstractControl | null{
    return this.personalDataForm.get('secondaryPhone')
  }

  get gender( ): AbstractControl | null{
    return this.personalDataForm.get('gender')
  }

  get maritalStatus( ): AbstractControl | null{
    return this.personalDataForm.get('maritalStatus')
  }

  get state( ): AbstractControl | null{
    return this.personalDataForm.get('state')
  }

  get residentialAddress( ): AbstractControl | null{
    return this.personalDataForm.get('residentialAddress');
  }

  get completedNYSC(): AbstractControl | null{
    return this.educationRelatedRecords.get('completedNYSC');
  }

  get university(): AbstractControl | null{
    return this.educationRelatedRecords.get('universityBSc');
  }



  getApprovedJobs(){
    this.jobservice.getJobBasedOnStatus('Approve')
    .subscribe(
      {
        next: ({result}) => {
          this.approvedJobs = result ?? [];
        },
        error: console.error
      }
    )
  }


  handleJobDisplay(event: {view: Views, data: AJob}){
    const {position, accountablities, experience, objective, organisationalCompetencies, educationalQualifications, personSpecification, professionalCompetencies, behavioralCompetencies, 
      departmentName, unit, supervises, id, classOfDegree, reportTo, locationName, deadline, grade, typeName, category, isInterviewRequired, isTestRequired} = event.data;
      this.dataFromCreateJob.jobTitle = position;
      this.dataFromCreateJob.unit = unit;
      this.dataFromCreateJob.jobObjectives = objective;
      this.dataFromCreateJob.accountabilities = accountablities;
      this.dataFromCreateJob.educationalQualifications = educationalQualifications;
      this.dataFromCreateJob.personSpecification = personSpecification;
      this.dataFromCreateJob.professionalCompetencies = professionalCompetencies;
      this.dataFromCreateJob.behavioralCompetencies = behavioralCompetencies;
      this.dataFromCreateJob.department = departmentName;
      this.dataFromCreateJob.supervise = supervises;
      this.dataFromCreateJob.reportTo = reportTo;
      this.dataFromCreateJob.location = locationName;
      this.dataFromCreateJob.deadline = deadline;
      this.dataFromCreateJob.grade = grade;
      this.dataFromCreateJob.category = category;
      this.dataFromCreateJob.testIsRequired = isTestRequired ? 'Yes' : 'No';
      this.dataFromCreateJob.interviewIsRequired = isInterviewRequired ? 'Yes' : 'No';
      this.dataFromCreateJob.type =typeName;
      this.dataFromCreateJob.classOfDegree = classOfDegree;
      this.dataFromCreateJob.organisationalCompetencies = organisationalCompetencies;
      this.dataFromCreateJob.experience = experience;
      this.dataFromCreateJob.id = id;

        this.sharedService.insertIntoAdjacentHtmlOfElement<HTMLElement, ElementRef, string>([
          {element: this.JobObjectivesThree, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.jobObjectives)},
          {element: this.AccountabilityThree, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.accountabilities)} ,
          {element: this.ProfessionalCompetenciesThree, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.professionalCompetencies)},
          {element: this.PersonSpecificationsThree, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.personSpecification)},
          {element: this.BehavioralCompetenciesThree, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.behavioralCompetencies)},
          {element: this.OrganisationalCompetenciesThree, content: this.sharedService.insertLisIntoUl( this.dataFromCreateJob.organisationalCompetencies)},
          {element: this.EducationalQualificationsThree, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.educationalQualifications)},
          {element:  this.ExperienceThree, content: this.sharedService.insertLisIntoUl(this.dataFromCreateJob.experience)}
       ])
       this.sharedService.showAllChildren([this.JobObjectivesThree, this.PersonSpecificationsThree, this.AccountabilityThree, this.ProfessionalCompetenciesThree, this.ExperienceThree, this.EducationalQualificationsThree, this.OrganisationalCompetenciesThree, this.BehavioralCompetenciesThree]);

       this.views = event.view;
  }

  gotoNextApplicationForm() {
    if(this.applicationView == 3) return;
    this.applicationView = this.applicationView + 1;
    this.setApplicationViewName();
  }

  gotoPreviousApplicationForm(){
    if(this.applicationView == 1) return;
    this.applicationView = this.applicationView - 1;
    this.setApplicationViewName();
  }

  setApplicationViewName(){
    switch(this.applicationView){
      case 1:
      this.applicationViewName = 'Personal';
      break;
      case 2:
      this.applicationViewName = 'Education';
      break;
      default:
      this.applicationViewName = 'Experience'
    }
  }

  acceptedYearsOfCompletion(): Array<number>{
    const years: Array<number> = [];
    const aYearInMs = 31536000000;
    let thirtyYearsAgo = Date.now() - (aYearInMs * 30);
    while(thirtyYearsAgo < Date.now()){
      const nextYear = thirtyYearsAgo + aYearInMs;
      thirtyYearsAgo = nextYear;
      years.push(new Date(nextYear).getFullYear());
    }
    return years;
  }

  insertImageIntoFileStorage(event: Event){
    const file: FileList = (event.target as HTMLInputElement).files!;
    if(this.sharedService.fileToBeStoredIsLessThanPreferredFileSize(file[0].size)){
      const reader = new FileReader();
      reader.onload = (e) => { 
        const img = e!.target!.result; 
        this.PassportInsertionPoint.nativeElement.style.backgroundImage = `url('${img}')`;
        this.PassportInsertionPoint.nativeElement.classList.add('backgroundImageAdded');
        // debugger;
        this.fileStorage = {...this.fileStorage, passport: file[0]}
      };
      reader.readAsDataURL(file[0]);
      return;
    }
    this.sharedService.errorSnackBar('The image you uploaded is more than 2mb');
  }

  insertFileIntoFileStorage(event: Event){
    const file: FileList = (event.target as HTMLInputElement).files!;
    if(this.sharedService.fileToBeStoredIsLessThanPreferredFileSize(file[0].size)){
        this.CVInsertionPoint.nativeElement.childNodes[1].textContent = file[0].name;
        this.fileStorage = {...this.fileStorage, cv: file[0]}
      return;
    }
    this.sharedService.errorSnackBar('The image you uploaded is more than 2mb');
  }

  previewApplication(){
    let foundState = this.states.find(elem => elem.id.toString() == this.state?.value.toString())
    let candidateDetails: Partial<RequiredApplicantDetails> = {...this.personalDataForm.value, ...this.educationRelatedRecords.value, ...this.extraInformation.value, passport: this.fileStorage.passport, cv: this.fileStorage.cv, stateName: foundState?.name};
    
    const config: MatDialogConfig = {
      panelClass: 'preview_application',
      width: '84.5vw',
      height: '75vh',
      maxWidth: '85vw',
      data: {applicantData: candidateDetails, extraInfo: {applicantSelectionScreen: false}}
    }
    const dialog = this.dialog.open(PreviewApplicationComponent, config);
    (dialog.afterClosed() as Observable<PreviewActions>).subscribe(
      {
        next: (val) => {
          if(val == PreviewActions.CLOSEANDEDIT) return;
          if(val == PreviewActions.CLOSEANDSUBMIT) this.applyForAJob();
        },
        error: error => console.error
      }
    )
  }

  addAnotherCertificate(){
    const acertificate = this.fb.group({certificate: ''});
    (this.certificates as FormArray).push(acertificate);
  }

  removeCertificate(certificatePosition: number){
    (this.certificates as FormArray).removeAt(certificatePosition);
  }

  applyForAJob(){
    const prevText1 = this.FormPreviewButton.nativeElement.textContent as string;
    const prevText2 = this.AsidePreviewButton.nativeElement.textContent as string;
    this.sharedService.loading4button(this.FormPreviewButton.nativeElement, 'yes', 'Submitting...');
    this.sharedService.loading4button(this.AsidePreviewButton.nativeElement, 'yes', 'Submitting...');
    let candidateDetails: Partial<RequiredApplicantDetails> = {...this.personalDataForm.value, ...this.educationRelatedRecords.value, ...this.extraInformation.value, applicationRefNo: '', jobId: this.dataFromCreateJob.id};
    this.personalDataForm.disable();
    this.educationRelatedRecords.disable();
    this.extraInformation.disable();
    candidateDetails.yearsOfExperience = parseInt(candidateDetails.yearsOfExperience as unknown as string);
    candidateDetails.certification = (candidateDetails.certification as Array<any>).length > 0 ? (candidateDetails.certification as Array<any>).map((elem: {certificate: string}) => elem.certificate ).join(' , '): '';
    this.externalCandidatesService.applyForJob(candidateDetails)
    .subscribe({
      next: ({info}) => {
        console.log(info);
        if(info == 'You have already applied for this job'){
          this.sharedService.errorSnackBar(`${info}`, 'close');
          this.sharedService.loading4button(this.FormPreviewButton.nativeElement, 'done',  prevText1);
        this.sharedService.loading4button(this.AsidePreviewButton.nativeElement, 'done', prevText2);
        this.personalDataForm.enable();
          this.educationRelatedRecords.enable();
          this.extraInformation.enable();
          return;
        }
        this.updateAUserWhoJustApplied(info, {btnOne: prevText1, btnTwo: prevText2})
      },
      error: (error) => {
        console.log(error);
        this.sharedService.errorSnackBar(`An error occured. Please check that you have entered all required fields`, 'close');
        this.sharedService.loading4button(this.FormPreviewButton.nativeElement, 'done',  prevText1);
       this.sharedService.loading4button(this.AsidePreviewButton.nativeElement, 'done', prevText2);
       this.personalDataForm.enable();
        this.educationRelatedRecords.enable();
        this.extraInformation.enable();
      }
    })
  }

  async updateAUserWhoJustApplied(appRef: any, btns: {btnOne:string, btnTwo: string }){
    const fileToUploadForApplicant = new FormData();
    fileToUploadForApplicant.append('CV', this.fileStorage.cv as File);
    fileToUploadForApplicant.append('Passport', this.fileStorage.passport as File);
    fileToUploadForApplicant.append('AppRef', appRef);
    try {
     const res = await lastValueFrom(this.externalCandidatesService.updateUser(fileToUploadForApplicant));
      if(!res.hasError) this.sharedService.successSnackBar('Your Application has been submitted successfully. Kindly check your email for further instructions.', 'close', 10000);
      else throw new Error('Uploading the Passport was unsuccessful!');
    } catch (error) {
      console.log(error);
      this.sharedService.errorSnackBar('Error occured while trying to apply for Job. Please try again later.', 'close');
    }
    finally{
     this.sharedService.loading4button(this.FormPreviewButton.nativeElement, 'done', btns.btnOne);
     this.sharedService.loading4button(this.AsidePreviewButton.nativeElement, 'done', btns.btnTwo);
     this.personalDataForm.enable();
    this.educationRelatedRecords.enable();
    this.extraInformation.enable();
    this.views = 'jobs';
    this.subView = 'apply';
    }   
  }

 get enableNextButtonsForPersonal(){
    if (this.personalDataForm.invalid)  return true;
    if (!this.fileStorage.hasOwnProperty('passport')) return true;
    return false;
  }

  get enablePreviewButtonForOthers(){
    if (!this.fileStorage.hasOwnProperty('cv')) return true;
    return false;
  }

  ngOnDestroy(){
   this.subscriptionsToClear.length > 0 && this.subscriptionsToClear.forEach(elem => elem?.unsubscribe())
  }
}
