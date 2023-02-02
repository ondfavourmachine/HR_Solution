import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, map, Observable } from 'rxjs';
import { NecessaryModalMethods } from 'src/app/models/applicant-selection.models';
import { BaseResponse, GeneralLookUp, RequiredApplicantDetails } from 'src/app/models/generalModels';
import { JobsService } from 'src/app/services/jobs.service';
import { LookUpService } from 'src/app/services/look-up.service';
import { SharedService } from 'src/app/services/sharedServices';
import { calcAgeFromDob } from 'src/app/services/small_reusable_functions';
import { PreviewJobDetailsComponent } from '../preview-job-details/preview-job-details.component';

@Component({
  selector: 'app-apply-for-job-by-internal-staff',
  templateUrl: './apply-for-job-by-internal-staff.component.html',
  styleUrls: ['./apply-for-job-by-internal-staff.component.scss']
})
export class ApplyForJobByInternalStaffComponent implements OnInit,NecessaryModalMethods {
  hasUploadedScore: boolean = false;
  uploadedMimeType!: string;
 universities$!: Observable<GeneralLookUp[]>;
 states$!: Observable<GeneralLookUp[]>
//  file: File | undefined;
 degrees$!:Observable<GeneralLookUp[]>;
 @ViewChild('InternalCandidatePassport') InternalCandidatePassport!: ElementRef<HTMLElement>;
 jobApplicationRequirements: Partial<RequiredApplicantDetails> = {
    residential_State: '',
    residentialAddress: '',
    dob: '',
    age: 0,
    classOfDegree: '',
    universityBSc: '',
    universityMSc: '',
    degree: '',
    courseMsc: '',
    courseofStudy: '',
    passport: undefined,
    certification: [],
    cv: undefined

 }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {jobId: any},
    private lookUpService: LookUpService, private dialog: MatDialog,
    private dialogRef: MatDialogRef<PreviewJobDetailsComponent>, public sharedService: SharedService, private jobservice: JobsService) { }
  

  ngOnInit(): void {
      this.universities$ =this.lookUpService.getUniversities().pipe(map(elem => elem.result));
      this.degrees$ =this.lookUpService.getDegrees().pipe(map(elem => elem.result));
      this.states$ = this.lookUpService.getStates().pipe(map(elem => elem.result));
  }

  insertImageIntoFileStorage(event: Event, type: 'passport' | 'cv'){
    const file: FileList = (event.target as HTMLInputElement).files!;
    if(this.sharedService.fileToBeStoredIsLessThanPreferredFileSize(file[0].size)){
      const reader = new FileReader();
      reader.onload = (e) => { 
        const img = e!.target!.result; 
        if(type == 'passport'){
          this.InternalCandidatePassport.nativeElement.style.backgroundImage = `url('${img}')`;
          this.InternalCandidatePassport.nativeElement.classList.add('backgroundImageAdded');
          this.jobApplicationRequirements.passport = file[0];
        }else{
          this.jobApplicationRequirements.cv = file[0];
          this.uploadedMimeType = img as string;
          this.hasUploadedScore = true;
        } 
      };
      reader.readAsDataURL(file[0]);
      return;
    }
    this.sharedService.errorSnackBar('The image you uploaded is more than 2mb');
  }

  closeBtn(val?: boolean): void {
    this.dialog.closeAll();
  }
  triggerUpload(target: string){
    (document.querySelector(`.${target}`) as HTMLElement).click();
  }
  // catchSelectedFile(event: Event){}
  removeUploadedFile(){
    this.jobApplicationRequirements.cv = undefined;
    this.hasUploadedScore = false;;
  }

  addCertification(){
    (this.jobApplicationRequirements.certification as Array<{name: ''}>).push({name: ''});
  }

  removeCertificates(index: number){
    (this.jobApplicationRequirements.certification as Array<any>).splice(index, 1);
  }

  handleAgeCalculation(event: any){
    this.jobApplicationRequirements.age = calcAgeFromDob(event);
  }

  async submitForm(event: Event){
    // console.log(this.jobApplicationRequirements);
    // let formToSubmit: Partial<RequiredApplicantDetails> = structuredClone(this.jobApplicationRequirements);
    // formToSubmit.certification = (formToSubmit.certification as Array<{name: ''}>).map(elem => elem.name).join(' , ');
    // const {cv, passport, ...rest} = formToSubmit;
    // formToSubmit = rest;
    // formToSubmit['jobId'] = this.data.jobId;
    // const btn = event.target as HTMLButtonElement;
    // const prevText = btn.textContent;
    // this.sharedService.loading4button(btn, 'yes', 'Submitting...'); 
    // try {
    //   const res = await lastValueFrom(this.jobservice.internalCandidateJobApplication(formToSubmit));
    //     if(res.statusCode == '200' && !res.hasError){
    //       this.sharedService.loading4button(btn, 'yes', 'Uploading Files...'); 
    //       await this.uploadCandidateFileToServer(res, cv, passport, btn, prevText as string);
    //       return;  
    //     }
    //     this.sharedService.errorSnackBar('Error occured while submitting form');
    // } catch (error) {
    //   this.sharedService.errorSnackBar('Fatal Error. Please try again later.')
    // }
    // this.closeBtn(true)
  }


 async  uploadCandidateFileToServer(res: BaseResponse<null>, cv: File | undefined, passport: File | undefined, btn: HTMLButtonElement, prevText: string){
    try {
      const fileToUploadForApplicant = new FormData();
      fileToUploadForApplicant.append('CV', cv as File);
      fileToUploadForApplicant.append('Passport', passport as File);
      fileToUploadForApplicant.append('AppRef', res.info as any);
      const uploadRes = await lastValueFrom(this.jobservice.internalCandidateJobApplicationUpload(fileToUploadForApplicant));
       if(!uploadRes.hasError && uploadRes.statusCode == '200'){
        this.sharedService.loading4button(btn, 'done', prevText); 
        this.sharedService.successSnackBar('Job Application was successful!');
        this.dialogRef.close(true);
        return;
      }
      throw 'Unable To Complete Job Application';
    } catch (error) {
      this.sharedService.errorSnackBar(typeof error == 'string' ? error : 'Fatal Error. Something went wrong. Try again later.');
    }
  }

}
