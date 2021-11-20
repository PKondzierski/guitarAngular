import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'referenceLesson'
})
export class ReferenceLessonPipe implements PipeTransform {


  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const text: string = ' minuta'
    return minutes.toString().padStart(minutes>9 ? 2 : 1, '0') + ':' + 
        (value - minutes * 60).toString().padStart(2, '0') + text;
 }

}
