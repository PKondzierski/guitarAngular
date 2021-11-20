import { sequence } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  } from '@angular/material/dialog';
import { CourseModel } from '../../model/course-model';
import { DataService } from '../../data.service';
import { LessonModel } from '../../lesson-model';
import { RequestService } from '../../request.service';
import { SectionDialogComponent } from '../../section-dialog/section-dialog.component';
import { SectionModel } from '../../section-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit, OnDestroy {
  panelOpenState: boolean = false;
  theatherMode: boolean = false;
  course?: CourseModel;
  isWaitingForDrop: boolean = false;
  subscription: Subscription = new Subscription;


  sectionGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });


  constructor(public dialog: MatDialog,
    private data: DataService,
    private http: RequestService) {}

  ngOnInit(): void {
    this.subscription.add(this.data.course.subscribe(response=>{
      this.course = response;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  dropSection(event: CdkDragDrop<string[]>) {
    if(!this.isWaitingForDrop && this.course != undefined && this.course.sections != undefined){

      moveItemInArray(this.course.sections!, event.previousIndex, event.currentIndex);
      this.isWaitingForDrop = true;
      this.http.swapSection(this.course.sections).subscribe((response)=>{
        this.isWaitingForDrop = false;
      },(error)=>{
        moveItemInArray(this?.course?.sections!, event.currentIndex, event.previousIndex);
        this.isWaitingForDrop = false;
      })  

    }
  }

  addSection() {
    const dialogRef = this.dialog.open(SectionDialogComponent, {
      width: '250px',
      autoFocus: false,
      data: [this.sectionGroup, 'sekcji'],
    });

    this.subscription.add(dialogRef.afterClosed().subscribe((sectionGroup: FormGroup)=>{
      if(this.course?.id != (undefined || null) && sectionGroup!=(undefined || null)){
        this.sectionGroup = sectionGroup;
        this.http.addSectionToCourse(this.course.id, this.sectionGroup.value).subscribe((response:SectionModel)=>{
          this.course?.sections.push(response);
          this.data.course.next(this.course);
        },(error)=>{

        })
      }
    }));
  }

  deleteSection(section: SectionModel){
    
  }


}
