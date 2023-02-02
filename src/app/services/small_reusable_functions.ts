
// this file contains extra utility functions

export const convertToBytesToMB = (bytes: number) => (bytes * 0.000001) / 1;

export const ages = (minAge: number, maxAge: number): Array<number> => {
  const arrToReturn: number[] = [];
  while(maxAge > minAge){
    maxAge = maxAge - 1;
     arrToReturn.push(maxAge);
  }
  return arrToReturn;
}

export const convertDateAndTimeToScheduleFormat = (date: string, time: string): string => `${time}--${date.split('-')[0]}--${date.split('-')[1]}--${date.split('-')[2]}`

export const calcAgeFromDob = (val: string) => new Date(Date.now()).getFullYear() - parseInt(val.split('-')[0]);