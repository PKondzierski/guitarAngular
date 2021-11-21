import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LessonModel } from '../lesson-model';
import { ChordModel } from '../model/chord-model';
import { ReferenceLesson } from '../model/reference-lesson-model';
import { RequestService } from '../request.service';

@Injectable({
  providedIn: 'root'
})

export class PanelService {

  chords: BehaviorSubject<ChordModel[]> = new BehaviorSubject(Array(0));
  referenceLessons: BehaviorSubject<ReferenceLesson[]> = new BehaviorSubject(Array(0));
  actualChord: BehaviorSubject<any> = new BehaviorSubject(null);
  jumpToTime: Subject<number> = new Subject();
  actualLesson: BehaviorSubject<any> = new BehaviorSubject(null);
  video: BehaviorSubject<string> = new BehaviorSubject('');
  videoUploaded: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: RequestService) { }


  updateLesson() {
    const actualLesson = this.actualLesson.value as LessonModel;
    actualLesson.chords = this.chords.value;
    actualLesson.references = this.referenceLessons.value;
    this.http.updateLesson(actualLesson).subscribe((lesson: LessonModel) => {
      this.actualLesson.next(lesson);
      this.chords.next(lesson.chords);
      this.referenceLessons.next(lesson.references);
    })
  }

  deleteLesson() {
    const actualLesson = this.actualLesson.value as LessonModel;
    this.http.deleteLesson(actualLesson).subscribe(()=>{
      this.actualLesson.next(null);
      window.location.reload();
    });
  }
}
