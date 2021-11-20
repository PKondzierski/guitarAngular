import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Player } from '@vime/angular';
import { BehaviorSubject, interval, Subscription} from 'rxjs';
import { AppSettings } from 'src/app/app-settings';
import { FretboardService } from 'src/app/components/fretboard/fretboard.service';
import { LessonModel } from '../../lesson-model';
import { ChordModel } from '../../model/chord-model';
import { ReferenceLesson } from '../../model/reference-lesson-model';
import { PanelService } from '../panel.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  @ViewChild('player') player!: Player;
  document: Document;
  chordList: string[] = [];
  error: string = '';
  chords: ChordModel[] = [];
  actualChord: BehaviorSubject<any> = new BehaviorSubject(null);
  upgradeFretBoardCheck: boolean = false;
  subscription: Subscription = new Subscription();
  references: ReferenceLesson[] = [];

  chordTimesGroup: FormGroup = new FormGroup({
    startChordTime: new FormControl(-1, [
      this.startChordTimeValidator.bind(this),
    ]),
    endChordTime: new FormControl(-1, [this.endChordTimeValidator.bind(this)]),
  });

  referenceForm: FormGroup = new FormGroup({
    begin: new FormControl('', this.referenceTimeValidator.bind(this)),
    name: new FormControl('', Validators.required),
  });

  video: string ='';

  constructor(
    private panelService: PanelService,
    @Inject(DOCUMENT) document: Document,
    private elRef: ElementRef,
    private fretboardService: FretboardService,
  ) {
    this.document = document;
  }

  ngOnInit(): void {
    const source = interval(100);
    this.subscription.add(source.subscribe(() => {
      this.upgradeFretBoard();
    }));

    this.subscription.add(this.panelService.jumpToTime.subscribe((time) => {
      if (time != null) this.player.currentTime = time;
    }));

    this.subscription.add(this.panelService.actualLesson.subscribe((lesson: LessonModel)=>{
      if(lesson.duration){
        const videoUrl = AppSettings.API_ENDPOINT + 'video/' + lesson.id;
        this.video = videoUrl;
        this.chords = lesson.chords;
        if (lesson.references) {
          this.references = lesson.references;
          this.references.sort((a: ReferenceLesson, b: ReferenceLesson) => a.begin - b.begin);
        }
      }
        setTimeout(()=>{
        const vim = this.elRef.nativeElement.querySelector('video');
        vim.load();
      })
    }));
  }
  referenceTimeValidator(control: AbstractControl): ValidationErrors | null {
    let time: string = control.parent?.get('begin')?.value;
    if (time) {
    const minutesAndSeconds: string[] = time.split(":");
    if (minutesAndSeconds.length != 2) {
      return { wrongTime: true};
    }
    const minutes: number = +minutesAndSeconds[0];
    const seconds: number = +minutesAndSeconds[1];
    if (Number.isNaN(minutes) || Number.isNaN(seconds) || seconds>59 || seconds<0) {
      return { wrongTime: true};
    }
    const begin: number = minutes*60 + seconds;
    if (this.player && (begin > this.player.duration || begin < 0)) {
      return { wrongTime: true };
    }
    let match: boolean = false;
    this.references.forEach((reference: ReferenceLesson) => {
      console.log(reference.begin);
      console.log(begin);
      if (reference.begin === begin) {
        match = true;
        }
      });
    if (match) {
      return { referenceExists: true};
    }
    }
    

    return null;
  }

  deleteReference(index: number) {
    this.references.splice(index,1);
    this.panelService.referenceLessons.next(this.references);
  }

  addReference() {
    this.referenceForm.markAllAsTouched();
    this.referenceForm.markAsDirty();
    if (this.referenceForm.valid) {
      let begin: string = this.referenceForm.get('begin')?.value;
      let name: string = this.referenceForm.get('name')?.value;
      const minutesAndSeconds: string[] = begin.split(":");
      const minutes: number = +minutesAndSeconds[0];
      const seconds: number = +minutesAndSeconds[1];
      const time: number = minutes*60 + seconds;
      this.references.push({
        begin: time,
        name: name
      });
      this.panelService.referenceLessons.next(this.references);
      this.references.sort((a: ReferenceLesson, b: ReferenceLesson) => a.begin - b.begin);
      this.referenceForm.patchValue({
        begin:'',
        name:''
      });
      this.referenceForm.markAsUntouched();
    }
  }

  checkIfCurrentTimeBetweenValues(a: number, b: number): boolean {
    if (this.player.currentTime >= a && this.player.currentTime <= b)
      return true;
    return false;
  }

  upgradeFretBoard() {

    this.chords.forEach((chord: ChordModel) => {
      if (
        this.player.currentTime > chord.startChordTime &&
        this.player.currentTime < chord.endChordTime &&
        this.actualChord.value != chord
      ) {
      
        this.fretboardService.resetFretboard(this.document);
        this.actualChord.next(chord);
        this.panelService.actualChord.next(this.actualChord.value);
        chord.chordList.forEach((stringId: string) => {
          this.fretboardService.setStringWithId(stringId, this.document);
        });
        this.setFormGroupValues(this.actualChord.value, false);
        this.upgradeFretBoardCheck = true;
        return;
      }
    });

    if (
      this.upgradeFretBoardCheck &&
      (this.player.currentTime > this.actualChord.value.endChordTime ||
        this.player.currentTime < this.actualChord.value.startChordTime)
    ) {
      this.actualChord.next(null);
      this.panelService.actualChord.next(this.actualChord.value);
      this.resetAllElements();
      this.upgradeFretBoardCheck = false;
    }

    if (
      (this.chordTimesGroup?.get('startChordTime')?.touched &&
        this.chordTimesGroup?.get('startChordTime')?.invalid) ||
      (this.chordTimesGroup?.get('endChordTime')?.touched &&
        this.chordTimesGroup?.get('endChordTime')?.invalid)
    ) {
      this.chordTimesGroup?.get('endChordTime')?.updateValueAndValidity();
      this.chordTimesGroup?.get('startChordTime')?.updateValueAndValidity();
    }
  }

  addAcord(): void {
    let startChordTimeValue: number =
      this.chordTimesGroup.get('startChordTime')?.value;
    let endChordTimeValue: number =
      this.chordTimesGroup.get('endChordTime')?.value;

    if (startChordTimeValue != -1)
      if (endChordTimeValue != -1)
       this.pushChord();
      else {
        this.chordTimesGroup.patchValue({
          endChordTime: this.player.currentTime,
        });
        this.chordTimesGroup.get('endChordTime')?.markAsTouched();
      }
    else {
      this.chordTimesGroup.patchValue({
        startChordTime: this.player.currentTime,
      });
      this.chordTimesGroup.get('startChordTime')?.markAsTouched();
    }
  }

  private pushChord(): void {
    if (this.chordTimesGroup.valid)
      if (this.chordList.length > 0) {
        let chord: ChordModel = {
          startChordTime: this.chordTimesGroup.get('startChordTime')?.value,
          endChordTime: this.chordTimesGroup.get('endChordTime')?.value,
          chordList: this.chordList,
          beatingList: []
        };
        if (!this.checkIfCordExists(chord.startChordTime, chord.endChordTime)) {
          this.chords.push(chord);
          this.panelService.chords.next(this.chords);
          this.resetAllElements();
        } else {
          this.error = 'Akord w przedziale czasowym istnieje';
        }
      } else {
        this.error = 'Musi być zaznaczona conajmniej 1 struna';
      }
  }

  updateChord(): void {
    if (this.actualChord.value != null) {
      if (this.chordTimesGroup.valid) {
        if (this.chordList.length > 0) {

          let chord: ChordModel = {
            startChordTime: this.chordTimesGroup.get('startChordTime')?.value,
            endChordTime: this.chordTimesGroup.get('endChordTime')?.value,
            chordList: this.chordList,
            beatingList: this.actualChord.value.beatingList
          };

          if (this.checkIfCordExistsUpdate(chord.startChordTime, chord.endChordTime)) {
            this.pushUpdatedChord(chord);
            this.error = 'Zaktualizowano akord';
          } else {
            if (!this.checkIfCordExists(chord.startChordTime, chord.endChordTime)) {
              this.pushUpdatedChord(chord);
              this.error = 'Zaktualizowano akord';
            }
            else{
              this.error = 'Nie udało się zaktalizować akordu';
            }
          }
        } else {
          this.error = 'Musi być zaznaczona conajmniej 1 struna';
        }
      }
    }
  }

  private pushUpdatedChord(chord: ChordModel) {
    let index: number = this.chords.findIndex((iterateChord) => {
      return (
        iterateChord.startChordTime ==
        Number(this.actualChord.value.startChordTime)
      );
    });
    this.chords[index] = chord;
    this.actualChord.next(chord);
    this.panelService.chords.next(this.chords);
  }

  startChordTimeValidator(control: AbstractControl): ValidationErrors | null {
    let endChordTimeValue = control.parent?.get('endChordTime')?.value;

    if (control.value <= 0) return { belowOrEqualZero: true };
    else if (control.value >= endChordTimeValue && endChordTimeValue != -1)
      return { overEndChordTime: true };
    return null;
  }
  endChordTimeValidator(control: AbstractControl): ValidationErrors | null {
    let startChordTimeValue = control.parent?.get('startChordTime')?.value;

    if (control.value <= 0) return { belowOrEqualZero: true };
    else if (control.value > this.player.duration)
      return { overVideoTime: true };
    else if (control.value <= startChordTimeValue && startChordTimeValue != -1)
      return { belowStartChordTime: true };
    return null;
  }
  checkIfCordExists(chordStartTime: number, chordEndTime: number): boolean {
    let chordExists: boolean = false;


    this.chords.forEach((chord: ChordModel) => {
      if (
        (chordEndTime > chord.startChordTime && chordEndTime <= chord.endChordTime) ||
        (chordStartTime >= chord.startChordTime && chordStartTime < chord.endChordTime) ||
        (chordStartTime <= chord.startChordTime && chordEndTime > chord.startChordTime)
      ) {
        if (this.actualChord.value && this.actualChord.value.startChordTime != chord.startChordTime && this.actualChord.value.endChordTime != chord.endChordTime) {
         chordExists = true;
        }
      }});
      return chordExists;
    }
  
  checkIfCordExistsUpdate(
    chordStartTime: number,
    chordEndTime: number
  ): boolean {
    let chordValidTime = false;

    if (this.actualChord.value != null) {
      let start = this.actualChord.value.startChordTime;
      let end = this.actualChord.value.endChordTime;
      if (chordStartTime >= start && chordEndTime <= end) {
        chordValidTime = true;
      }
    }
    return chordValidTime;
  }

  getStartChordTimeError(): string {
    let error = this.chordTimesGroup.get('startChordTime');
    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
      else if (error.hasError('belowOrEqualZero'))
        return 'Błędny czas początku akordu';
      else if (error.hasError('overEndChordTime'))
        return 'Błędny czas początku akordu';
    }
    return '';
  }


  getReferenceError() {
    let error = this.referenceForm.get('begin');
    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
      else if (error.hasError('wrongTime')) {
        return 'Błędny czas sekcji';
      } else if (error.hasError('referenceExists')) {
        return 'Początek sekcji już istnieje'
      }
    }
    return '';
  }
  getEndChordTimeError(): string {
    let error = this.chordTimesGroup.get('endChordTime');
    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
      else if (error.hasError('belowOrEqualZero'))
        return 'Błędny czas końca akordu';
      else if (error.hasError('overVideoTime'))
        return 'Błędny czas końca akordu';
      else if (error.hasError('belowStartChordTime'))
        return 'Błędny czas końca akordu';
      // else if (error.hasError('chordExists')) return 'Akord już istnieje';
    }
    return '';
  }

  private resetAllElements(): void {
    this.fretboardService.resetFretboard(this.document);
    this.resetTimes();
    this.error = '';
    this.chordList = [];
  }
  private resetTimes(): void {
    this.chordTimesGroup.patchValue({
      startChordTime: -1,
      endChordTime: -1,
      //   arleadyAdded: true,
    });
    this.chordTimesGroup.get('startChordTime')?.markAsUntouched();
    this.chordTimesGroup.get('endChordTime')?.markAsUntouched();
  }

  addStringToChord(event: Event): void {
    this.fretboardService.getString(event, this.document, this.chordList);
  }

  setFormGroupValues(chord: ChordModel, emitEvent: boolean) {
    this.chordTimesGroup.setValue(
      {
        startChordTime: chord.startChordTime,
        endChordTime: chord.endChordTime,
      },
      { emitEvent: emitEvent }
    );
    this.chordList = chord.chordList;
  }

  swapTimes(): void {
    let temp = this.chordTimesGroup.get('endChordTime')?.value;
    this.player.currentTime =
      this.chordTimesGroup.get('endChordTime')?.value + 0.000001;
    this.upgradeFretBoard();
    this.chordTimesGroup.patchValue({
      startChordTime: temp,
      endChordTime: -1,
    });
    this.chordTimesGroup.get('endChordTime')?.markAsUntouched();
  }

  // test(): void {
  // this.player.currentTime = this.panelService.currentTime.getValue();
  // this.video = 'http://techslides.com/demos/sample-videos/small.mp4';
  // vim.load();
  // vim.play();
  // const vim = this.elRef.nativeElement.querySelector('video')
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
