import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CourseModel } from '../../model/course-model';
import { DataService } from '../../data.service';
import { LessonModel } from '../../lesson-model';
import { RequestService } from '../../request.service';
import { SectionDialogComponent } from '../../section-dialog/section-dialog.component';
import { SectionModel } from '../../section-model';
import { PanelService } from '../panel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit, OnDestroy {

@Input() section!: SectionModel;
@Input() course:CourseModel|undefined;
subscription: Subscription = new Subscription;
actualLessonId: number = -1;
  isWaitingForDrop: boolean = false;
  lessonGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });
 
  constructor(private http: RequestService,
     public dialog: MatDialog,
     private data: DataService,
     private panelService: PanelService) { }


  ngOnInit(): void {
    this.subscription.add(this.panelService.videoUploaded.subscribe((lesson: LessonModel)=>{
      if(lesson){
        this.section.lessons.map((foundLesson)=>{
          if(foundLesson.id == lesson.id){
            foundLesson.duration = lesson.duration;
          }
        })
      }
    }));
  }

  dropLesson(event: CdkDragDrop<string[]>, section : SectionModel){
    if(!this.isWaitingForDrop && section != (undefined || null)){
      moveItemInArray(section.lessons, event.previousIndex, event.currentIndex);
      this.isWaitingForDrop = true;
      this.http.swapLesson(section.lessons).subscribe((response)=>{
        this.isWaitingForDrop = false;
      },(error)=>{
        moveItemInArray(section.lessons, event.currentIndex, event.previousIndex);
        this.isWaitingForDrop = false;
      })  
    }
  }

  addLesson(section: SectionModel){
    const dialogRef = this.dialog.open(SectionDialogComponent, {
      width: '250px',
      autoFocus: false,
      data: [this.lessonGroup,'lekcji'],
    });

    this.subscription.add(dialogRef.afterClosed().subscribe((lessonGroup: FormGroup)=>{
      if(section!=(null || undefined) && section.id != (null || undefined) &&  lessonGroup!=(undefined || null)){
        this.lessonGroup = lessonGroup;
        this.http.addLessonToCourse(section.id, this.lessonGroup.value).subscribe((response:LessonModel)=>{
          section.lessons.push(response);
          this.data.course.next(this.course);
        },(error)=>{

        })
      }
    }));
  }

  moveToLesson(lesson: LessonModel){
      setTimeout(()=>{
        this.panelService.actualLesson.next(lesson);
          this.actualLessonId = lesson.id;
          this.panelService.chords.next(lesson.chords); 
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
