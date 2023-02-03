import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApplicantSelectionStatistics } from 'src/app/models/applicant-selection.models';
import { AGlobusBranch, RequiredQuarterFormat, tabs } from 'src/app/models/generalModels';
import { BroadCastService } from 'src/app/services/broad-cast.service';
import { SchedulerDateManipulationService } from 'src/app/services/scheduler-date-manipulation.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-home-selection',
  templateUrl: './home-selection.component.html',
  styleUrls: ['./home-selection.component.scss']
})
export class HomeSelectionComponent implements OnInit, OnDestroy {
  quartersToUse: RequiredQuarterFormat[] = [];
  agesToUse: number[] = [];
  globusBranches: AGlobusBranch[] = [];
  statistics: Partial<ApplicantSelectionStatistics> = {};
  tabList: tabs[] = ['All Applications', 'Tests', 'Interview 01', 'Interview 02', 'Interview 03', 'Medical', 'Offer', 'Post Acceptance'];
  slideConfig = {slidesToShow: 5, slidesToScroll: 5, arrows: true, variableWidth: true, infinite: false, swipeToSlide: true};
  slides = ['All Application','Pending','Accepted','Rejected','Awaiting Approval','Returned',];
  hideCarousel: boolean = false;
  destroySub!: Subscription
  constructor(
    private sdm: SchedulerDateManipulationService,
    private router: Router,
    public  sharedService: SharedService, 
    private broadCast: BroadCastService
  ) { }

  ngOnInit(): void {
    const res = this.sdm.generateQuartersOfCurrentYear();
    this.quartersToUse = this.sdm.presentQuartersInHumanReadableFormat(res);    
    this.agesToUse = this.sharedService.generateAges();
    this.destroySub = this.broadCast.statistics$.subscribe(stats => this.statistics = stats)
  }

  toggleSlidingContainer(){
    this.hideCarousel = !this.hideCarousel;
  }

  gotoAnotherRoute(event: string){
    switch(event){
      case 'Interview 01':
      this.router.navigateByUrl(`dashboard/applicant-selection/interviews`);
      break;
      case 'Post Acceptance':
      this.router.navigateByUrl(`dashboard/applicant-selection/post-acceptance`);
      break;
      case 'Interview 02':
      case 'Interview 03':
      const urlBreakdown = event.split(' ');
      this.router.navigateByUrl(`dashboard/applicant-selection/interviews/${urlBreakdown[1]}`);
      break;
      default:
      this.router.navigateByUrl(`dashboard/applicant-selection/${event.toLowerCase()}`);
    }
  }

  nextSlide(){
    const nextArrow = document.querySelectorAll('.slick-next') as NodeListOf<HTMLElement>;
    nextArrow[0].click();
  }

  beforeChange(event: any) {
    console.log('beforeChange');
  }

  afterChange(event: any){
    console.log('afterchange' + ` ${event}`)
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }
  
  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  

  ngOnDestroy(): void {
    this.destroySub.unsubscribe()
  }

}
