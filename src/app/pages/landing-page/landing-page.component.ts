import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  slideConfig = {slidesToShow: 3, slidesToScroll: 3, arrows: true, variableWidth: true, infinite: true, swipeToSlide: true};
  slides = ['All Application','Pending','Accepted','Rejected','Awaiting Approval','Returned',];
  imageObject: Array<object> = [{
    image: '../../../assets/images/first_image.png',
    thumbImage: '../../../assets/images/first_image.jfif',
    alt: 'first image',
    title: 'title of image'
}, {
    image: '../../../assets/images/second_image.png', // Support base64 image
    thumbImage: '../../../assets/images/second_image.jfif', // Support base64 image
    title: 'Image title', //Optional: You can use this key if want to show image with title
    alt: 'Second image', //Optional: You can use this key if want to show image with alt
    order: 1 //Optional: if you pass this key then slider images will be arrange according @input: slideOrderType
},
{
  image: '../../../assets/images/second_image.png', // Support base64 image
  thumbImage: '../../../assets/images/third_image.jfif', // Support base64 image
  title: 'Image title', //Optional: You can use this key if want to show image with title
  alt: 'Second image', //Optional: You can use this key if want to show image with alt
  order: 1 //Optional: if you pass this key then slider images will be arrange according @input: slideOrderType
}
];
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
