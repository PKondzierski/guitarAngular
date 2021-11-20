import { Comment } from './../comment/comment';
import { Note } from './../note/note';
import {DOCUMENT} from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {Player} from '@vime/angular';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { AppSettings } from 'src/app/app-settings';
import { FretboardService } from 'src/app/components/fretboard/fretboard.service';
import {WindowService} from '../../../global-services/window.service';
import { LessonModel } from '../../create-course/lesson-model';
import { BeatingModel } from '../../create-course/model/beating-model';
import { ChordModel } from '../../create-course/model/chord-model';
import { ReferenceLesson } from '../../create-course/model/reference-lesson-model';
import { BeatingType } from '../../create-course/panel/chord/chord.component';
import { CourseService } from '../service/course.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  theatherMode = false;
  @ViewChild('player') player!: Player;
  subscription: Subscription = new Subscription();
  videoUrl: string = '';
  chords: ChordModel[] = [];
  actualChord?: ChordModel;
  document: Document;
  upgradeFretBoardCheck: boolean = true;
  fretboardOnScreen: boolean = true;
  fretboardUnderScreen: boolean = false;
  beatingType = BeatingType;
  beatingOnScreen: boolean = true;
  innerWidth: Number = window.innerWidth;
  
  

  constructor(
    private windowService: WindowService,
    public courseService: CourseService,
    private elRef: ElementRef,
    private fretboardService: FretboardService,
    @Inject(DOCUMENT) document: Document
  ) {
    this.document = document;
  }

  ngOnInit(): void {
    this.subscription.add(this.courseService.actualLesson.subscribe((lesson: LessonModel) => {
      this.chords = lesson.chords;
      this.courseService.references = lesson.references.sort((a:ReferenceLesson, b:ReferenceLesson) => a.begin-b.begin);

      this.getAdditionalData(lesson.id);
      this.chords.forEach((chord: ChordModel) => {
        chord.beatingList.sort((a: BeatingModel, b: BeatingModel) => a.sequence - b.sequence)
      });

      this.videoUrl = AppSettings.API_ENDPOINT + 'video/' + lesson.id;
      this.player.buffering = true;
      setTimeout(()=>{
        const vim = this.elRef.nativeElement.querySelector('video');
        vim.load();
        this.player.buffering = false;
        // this.player.play();
      },250)
    }));

    this.subscription.add(this.courseService.actualTime.subscribe((time: number) => {
      this.player.currentTime = time;
    }));

    this.subscription.add(this.windowService.windowWidth.subscribe((width) => this.innerWidth = width));

    setInterval(()=> {
      this.upgradeFretBoard();
      this.updateActualLessonTime();
    }, 50);
  }

  getAdditionalData(lessonId: number) {
    this.subscription.add(this.courseService.getCommentsByLessonId(lessonId).subscribe((comments: Comment[]) => {
      this.courseService.setComments(comments);
    }));
    this.subscription.add(this.courseService.getNotesByLessonId(lessonId).subscribe((notes: Note[]) => {
      this.courseService.setNotes(notes);
    }));
  } 
  
  changeTheatherMode() {
    if (!this.player.isMobile && window.innerWidth > 1300) {
      this.theatherMode = !this.theatherMode;
      this.windowService.theatherMode.next(this.theatherMode);
    }
  }
  updateActualLessonTime() {
    this.courseService.actualLessonTime.next(this.player.currentTime);
  }

  upgradeFretBoard() {
    if ( this.actualChord &&
      !this.upgradeFretBoardCheck &&
      (this.player.currentTime > this.actualChord.endChordTime ||
        this.player.currentTime < this.actualChord.startChordTime)
    ) {
      this.actualChord = undefined;
      this.fretboardService.resetFretboard(this.document);
      this.upgradeFretBoardCheck = true;
    } 
    
    
    if (this.upgradeFretBoardCheck) {
    this.chords.forEach((chord: ChordModel) => {
      if (
        this.player.currentTime > chord.startChordTime &&
        this.player.currentTime < chord.endChordTime &&
        this.actualChord != chord
      ) {
        this.fretboardService.resetFretboard(this.document);
        this.actualChord = chord;
        chord.chordList.forEach((stringId: string) => {
          this.fretboardService.setStringWithId(stringId, this.document);
        });
        this.upgradeFretBoardCheck = false;
        return;
      }
    });
  }
  }

  // ngAfterViewChecked(): void {
  //   setTimeout(() => {
  //     let shadow = <HTMLElement>(
  //       document
  //         .querySelector('vm-player')
  //         ?.shadowRoot?.querySelector('.player')
  //     );
  //     shadow.style.zIndex = '0';
  //   });
  // }


  hideFretboard() {
    this.fretboardOnScreen = !this.fretboardOnScreen;
    this.updateValuesAfterHideClick();

  }

  hideFretboardUnderVideo() {
    this.fretboardUnderScreen = !this.fretboardUnderScreen;
    this.updateValuesAfterHideClick();
  }

  updateValuesAfterHideClick() {
    if (this.fretboardOnScreen || this.fretboardUnderScreen){
      this.actualChord = undefined;
      this.upgradeFretBoardCheck = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    window.clearInterval();
  }
}
