import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnApplication, InformationForModal, RequiredApplicantDetails } from 'src/app/models/generalModels';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-applicant-image-cv-details',
  templateUrl: './applicant-image-cv-details.component.html',
  styleUrls: ['./applicant-image-cv-details.component.scss']
})
export class ApplicantImageCvDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('ImagePort') ImagePort!: ElementRef<HTMLImageElement>;
  @ViewChild('CVPort') CVPort!: ElementRef<HTMLElement>;
  @Input() data!: InformationForModal<AnApplication & RequiredApplicantDetails>
  cvName!: string;
  currentRoute!:string;
  constructor(public sharedService: SharedService, private dialog: MatDialog, private route: Router) { }

  ngOnInit(): void {
    console.log(this.data);
    this.currentRoute = this.route.url;
    this.cvName = this.data.applicantData.cV_URL?.split('/')[4];
  }

  ngAfterViewInit(): void {
    this.CVPort.nativeElement.textContent = this.data.applicantData.cv! instanceof File ? this.data.applicantData.cv?.name  as string : this.data.applicantData.cv as unknown as string || this.cvName;
    const {passport, passport_URL} = this.data.applicantData;
    if(passport_URL && passport_URL.includes('http')){
      this.ImagePort.nativeElement.src = passport_URL;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.ImagePort.nativeElement.src = e.target?.result as any;
    }
    reader.readAsDataURL(passport as File);
  }

  downloadCV(){
    this.sharedService.downloadFile(this.data?.applicantData!.cV_URL);
  }

  routeToJobMgtForPreviewPurposes(){
    this.dialog.closeAll();
    // debugger;
    this.route.navigate(['dashboard', 'job-management'], {queryParams: {dataFromPreviewApplication: this.data.applicantData.jobId, appId: this.data.applicantData.applicationId, redirect: this.currentRoute}})
  }


  
  

}
