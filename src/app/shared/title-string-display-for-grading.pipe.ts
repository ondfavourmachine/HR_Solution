import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleStringDisplayForGrading'
})
export class TitleStringDisplayForGradingPipe implements PipeTransform {

  transform(item: number): string {
    let returnVal!: string;
    switch(item){
      case 1:
      returnVal = 'Very Poor'
      break;
      case 2:
      returnVal = 'Poor'
      break;
      case 3:
      returnVal = 'Good'
      break;
      case 4:
      returnVal = 'Very Good'
      break;
      default:
      returnVal = 'Excellent'
    }
    return returnVal;
  }

}
