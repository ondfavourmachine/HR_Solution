import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1, 'arrows': true,  'autoplay': true, 'autoplaySpeed': 2500, 'dots': true};
  slides = [{img: '../../../assets/images/first_image.jfif'}, {img: '../../../assets/images/second_image.jfif'}, {img: '../../../assets/images/third_image.jfif'}];
  
  constructor() { }

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

  openOrCloseContent(event:Event){
    const parent = (event.target as HTMLElement).closest('.tab_content');
    parent?.classList.toggle('elongate')
  }
  
  // nextSlide(){
  //   const nextArrow = document.querySelectorAll('.slick-next') as NodeListOf<HTMLElement>;
  //   nextArrow[0].click();
  // }

}
