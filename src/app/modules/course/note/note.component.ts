import { LessonModel } from './../../create-course/lesson-model';
import { WindowService } from 'src/app/global-services/window.service';
import { CourseService } from './../service/course.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from './note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  isTheather: boolean = false;
  actualMinute: number = 0;
  actualSecond: number = 0;
  lesson?: LessonModel;
  note: string = '';
  notes: Note[] = [];
  
  constructor(
    public courseService: CourseService,
    private windowService: WindowService) {
  }

  ngOnInit(): void {
    
    this.subscription.add(this.windowService.theatherMode.subscribe((mode: boolean) => {
      this.isTheather = mode;
    }));

    this.subscription.add(this.courseService.actualLessonTime.subscribe((time: number) => {
      const roundedTime: number = Math.round(time)
      this.actualMinute = Math.trunc(roundedTime/60);
      this.actualSecond = roundedTime%60;
    }));

    this.subscription.add(this.courseService.actualLesson.subscribe((lesson: LessonModel) => {
      this.lesson = lesson;
    }));
    

  }

  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addNote() {
    if (this.lesson && this.note !== '') {
      const note: Note = {
        lessonId: this.lesson.id,
        note: this.note,
        time: this.actualMinute*60 + this.actualSecond
      };
      this.courseService.saveNote(note).subscribe((notes: Note[]) => {
        this.courseService.setNotes(notes);
        this.note = '';
      });
    }
  }

}
