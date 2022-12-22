import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  constructor(public sharedService: SharedService) { }

  ngOnInit(): void {
    console.log(this.data.extraInfo);
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


  
  

}
