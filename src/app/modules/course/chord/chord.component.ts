import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { Chord } from './chord';

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.scss']
})
export class ChordComponent implements OnInit {

  chords: Chord[] = [];
  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.getChords().subscribe((chords: Chord[]) => this.chords = chords);
    this.chords.sort((a,b) => Number(a.name) - Number(b.name));
  }

}
