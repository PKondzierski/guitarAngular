import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BeatingModel } from '../../model/beating-model';
import { ChordModel } from '../../model/chord-model';
import { PanelService } from '../panel.service';

export enum BeatingType {
  UP,
  DOWN,
  PAUSE,
}

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.scss']
})
export class ChordComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource = new MatTableDataSource<ChordModel>();
  chords: ChordModel[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  beatingType = BeatingType;
  MAX_BEATING: number = 8;
  matSelectBeatingList: BeatingModel[] = [];
  columnsToDisplay =['number','startChordTime','endChordTime','beating']
  copyOfBeating: number[] = [];
  copyOfBeatingVisible: string[] = [];
  indexToCopy: number = 0;
  subscription: Subscription = new Subscription;
  constructor(private panelService: PanelService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit( ): void {
    this.subscription.add(this.panelService.chords.subscribe((chords: ChordModel[])=>{
      chords.sort((a: ChordModel, b: ChordModel) => a.startChordTime - b.startChordTime);
      chords.forEach((chord: ChordModel) => {
        chord.beatingList.sort((a: BeatingModel, b: BeatingModel) => a.sequence - b.sequence)
      });
      this.dataSource.data = chords;
      this.chords = chords;
      this.changeDetectorRefs.detectChanges();
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void{
    this.dataSource.paginator = this.paginator;
  }

  jumpToChord(time: number):void{
    this.panelService.jumpToTime.next(time);
  }

  addUpBeat(chord: ChordModel): void{
    if(this.isMaxBeating(chord.beatingList))
      return;
    let beating: BeatingModel = {
      beat:BeatingType.UP,
      sequence: this.getLastAvailableSequence(chord.beatingList)
    }
    chord.beatingList.push(beating);
    console.log(chord);
    this.panelService.chords.next(this.chords)
  }
  addPauseBeat(chord: ChordModel): void{
    console.log(this.copyOfBeating);
    if(this.isMaxBeating(chord.beatingList))
      return;
    let beating: BeatingModel = {
      beat:BeatingType.PAUSE,
      sequence: this.getLastAvailableSequence(chord.beatingList)
    }
    chord.beatingList.push(beating);
    this.panelService.chords.next(this.chords)
  }
  addDownBeat(chord: ChordModel): void{
    if(this.isMaxBeating(chord.beatingList))
     return;
    let beating: BeatingModel = {
      beat:BeatingType.DOWN,
      sequence: this.getLastAvailableSequence(chord.beatingList)
    }
    chord.beatingList.push(beating);
    this.panelService.chords.next(this.chords)

  }

  deleteBeat(chord: ChordModel, beat: BeatingModel): void{

    chord.beatingList.splice(beat.sequence,1);
    this.panelService.chords.next(this.chords);
  }

  deleteChord(chord: ChordModel): void{
    const index = this.chords.indexOf(chord, 0);
    if(index != -1){

      this.copyOfBeating.forEach((copy: number, i: number) => {
        if (copy === index) {
          copy = -1;
          this.copyOfBeatingVisible[i] = '';
        }
          if (copy && copy >= 0 && copy > index) {
            this.copyOfBeating[i] = copy - 1;
            this.copyOfBeatingVisible[i] = String(copy);
        }
      })
      this.chords.splice(index, 1);
      this.copyOfBeating.splice(index, 1);
      this.copyOfBeatingVisible.splice(index, 1);
      this.panelService.chords.next(this.chords);
    }
  }

  isMaxBeating(beatingList: BeatingModel[]): boolean{
    return beatingList.length > this.MAX_BEATING ? true : false;
  }

  getLastAvailableSequence(beatingList: BeatingModel[]): number{
     return beatingList.length != 0 ? beatingList.length : 0;
  }

  addCopy(event: Event, chordIndex: number) {
    const indexToCopy: string =  (<HTMLInputElement>event.target).value; 
    if (!Number.isNaN(Number(indexToCopy))) {
      this.copyOfBeating[chordIndex] = Number(indexToCopy)-1;
      this.copyOfBeatingVisible[chordIndex] = indexToCopy;
    }
  }

  refreshCopy() {
    let i: number = 0;
    while (i < this.chords.length){
    this.chords.forEach((chord: ChordModel, index: number) => {
      if (this.copyOfBeating[index] >= 0 && this.copyOfBeating[index] < this.chords.length && this.chords[this.copyOfBeating[index]].beatingList) {
        chord.beatingList = JSON.parse(JSON.stringify(this.chords[this.copyOfBeating[index]].beatingList));
      } else {
        chord.beatingList = JSON.parse(JSON.stringify(chord.beatingList));
        this.copyOfBeating[index] = -1;
        this.copyOfBeatingVisible[index] = '';
      }
    })
    i++;
  }
  }


}
