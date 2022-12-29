import { Component, OnInit, inject, Inject } from '@angular/core';
import { NecessaryModalMethods } from 'src/app/models/applicant-selection.models';
import { PostAcceptanceInfo } from 'src/app/models/generalModels';
import { ExternalApplicantService } from 'src/app/services/external-applicant.service';
import { SharedService } from 'src/app/services/sharedServices';
import {lastValueFrom} from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-post-acceptance-information',
  templateUrl: './post-acceptance-information.component.html',
  styleUrls: ['./post-acceptance-information.component.scss']
})
export class PostAcceptanceInformationComponent implements OnInit, NecessaryModalMethods {
  postAcceptanceInformation: Partial<PostAcceptanceInfo> = {
    applicationRefNo: '',
    referenceName: '',
    referencePhone: '',
    referenceEmail: '',
    referenceAddress: '',
    taxId:'',
    nhfno: '',
    pensionNo: '',
    pensionProvider: '',
    passport: '',
    olevel: '',
    degree: '',
    nysc: '',
    marriage: '',
    masters: '',
    certificate: '',
    nameChange: '',
  }
  sharedService!: SharedService;
  externalService!: ExternalApplicantService;
  defaultDisplay: any = '../../../assets/images/pdf_uploaded.svg';
       constructor(@Inject(MAT_DIALOG_DATA) public data: {applicationRefNo: string}, private dialog: MatDialog){
        this.sharedService = inject(SharedService);
        this.externalService = inject(ExternalApplicantService);
       }
  closeBtn(val?: any): void { }

  ngOnInit(): void {
  }

 get enableSubmitBtn(): boolean{
  if( this.postAcceptanceInformation.passport instanceof File && this.postAcceptanceInformation.olevel instanceof File 
  && this.postAcceptanceInformation.degree instanceof File && this.postAcceptanceInformation.nysc instanceof File &&
  this.postAcceptanceInformation.referenceName!.length > 2 && this.postAcceptanceInformation.referencePhone!.length > 2 &&
  this.postAcceptanceInformation.referenceEmail!.length > 2 && this.postAcceptanceInformation.referenceAddress!.length > 2 ) return false;
  return true;
  }


  removeUploadedFile(name: keyof PostAcceptanceInfo ){
    this.postAcceptanceInformation[name] = ''
  }

  convertToHumanReadableFileSize(name: keyof PostAcceptanceInfo){
   return  this.sharedService.convertToHumanReadableFileSize((this.postAcceptanceInformation[name] as File).size)
  }

  getNameOfFile(name: keyof PostAcceptanceInfo){
    return (this.postAcceptanceInformation[name] as File).name;
  }

   shouldShowFileUploadedDisplay(name: keyof PostAcceptanceInfo): boolean{
     return this.postAcceptanceInformation[name] instanceof File;
  }

  handlePickedFile(event: Event, name: keyof PostAcceptanceInfo){
    const file: FileList = (event.target as HTMLInputElement).files!;
    if(this.sharedService.fileToBeStoredIsLessThanPreferredFileSize(file[0].size)){
      const reader = new FileReader();
      reader.onload = (e) => { 
        const img = e!.target!.result; 
        if(name == 'passport'){
          this.defaultDisplay = img;
          this.postAcceptanceInformation[name] = file[0] as File
        }else{
          this.postAcceptanceInformation[name] = file[0] as any;
        }
        
      };
      reader.readAsDataURL(file[0]);
      return;
    }
    this.sharedService.errorSnackBar('The image you uploaded is more than 2mb');
  }


  async startAddingDocuments(event: Event){
    const btn = event.target as HTMLButtonElement;
    const prevText = btn.textContent;
    this.sharedService.loading4button(btn, 'yes', 'Uploading reference details...');
    const {taxId, pensionNo, pensionProvider, marriage, degree, nysc, olevel, passport, masters, certificate, nhfno, referenceAddress, referenceEmail, referenceName, referencePhone} = this.postAcceptanceInformation;
    // debugger;
    try {    
    const res = await lastValueFrom(this.externalService.addReferences({ applicationRefNo: this.data.applicationRefNo, taxId, pensionNo, pensionProvider, nhfno, referenceAddress, referenceEmail, referenceName, referencePhone}));
    this.sharedService.loading4button(btn, 'yes', 'Uploading documents...');
    const res2 = await lastValueFrom(this.externalService.addAcceptanceDocuments({ applicationRefNo: this.data.applicationRefNo, marriage, degree, nysc, olevel, passport, masters, certificate}));
    this.sharedService.loading4button(btn, 'done', prevText as string);
    if(res2.statusCode == '200'){
      this.sharedService.successSnackBar('Reference and Documents have been uploaded successfully!');
      this.dialog.closeAll();
    }
    } catch (error) {
      console.error;
      this.sharedService.loading4button(btn, 'done', prevText as string);
      this.sharedService.errorSnackBar('Error occured while trying to upload the documents');
    }
  }

}
