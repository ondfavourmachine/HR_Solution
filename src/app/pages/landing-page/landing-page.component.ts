import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  slideConfig = {slidesToShow: 3, slidesToScroll: 3, arrows: true, variableWidth: true, infinite: true, swipeToSlide: true};
  slides = ['All Application','Pending','Accepted','Rejected','Awaiting Approval','Returned',];
  constructor(
  ) { }

  ngOnInit(): void {}

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }
  
  slickInit(e: any) {
    console.log('slick initialized');
  }

  beforeChange(event: any) {
    console.log('beforeChange');
  }

  afterChange(event: any){
    console.log('afterchange' + ` ${event}`)
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }
  
  nextSlide(){
    const nextArrow = document.querySelectorAll('.slick-next') as NodeListOf<HTMLElement>;
    nextArrow[0].click();
  }

}
