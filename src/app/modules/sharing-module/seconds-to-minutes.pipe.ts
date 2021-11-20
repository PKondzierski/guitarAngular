import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToMinutes'
})
export class SecondsToMinutesPipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const text: string = value>=60 && value<120 ? ' minuta' : ' minut';
    return minutes.toString().padStart(minutes>9 ? 2 : 1, '0') + ':' + 
        (value - minutes * 60).toString().padStart(2, '0') + text;
 }

}
