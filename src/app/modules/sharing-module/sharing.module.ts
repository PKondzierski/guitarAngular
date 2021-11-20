import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondsToMinutesPipe } from './seconds-to-minutes.pipe';
import { ReferenceLessonPipe } from './reference-lesson.pipe';



@NgModule({
  declarations: [
    SecondsToMinutesPipe,
    ReferenceLessonPipe
  ],
  exports: [
    SecondsToMinutesPipe,
    ReferenceLessonPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharingModule { }
