import { FormsModule } from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CourseComponent} from './course.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {VimeModule} from '@vime/angular';
import {VideoComponent} from './video/video.component';
import {LessonsComponent} from './lessons/lessons.component';
import {LessonComponent} from './lessons/lesson/lesson.component';
import {MaterialModule} from 'src/app/material/material.module';
import {FretboardComponent} from 'src/app/components/fretboard/fretboard.component';
import {AboutCourseComponent} from './about-course/about-course.component';
import { SharingModule } from '../sharing-module/sharing.module';
import { ReferencesComponent } from './references/references.component';
import { CoursesComponent } from './courses/courses.component';
import { NoteComponent } from './note/note.component';
import { CommentComponent } from './comment/comment.component';
import { SubCommentComponent } from './comment/sub-comment/sub-comment.component';
import { ChordComponent } from './chord/chord.component';


@NgModule({
  declarations: [
    CourseComponent,
    VideoComponent,
    LessonsComponent,
    LessonComponent,
    AboutCourseComponent,
    FretboardComponent,
    ReferencesComponent,
    CoursesComponent,
    NoteComponent,
    CommentComponent,
    SubCommentComponent,
    ChordComponent,
    
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    VimeModule,
    MaterialModule,
    SharingModule,
    FormsModule
    ],
  exports: [
    CourseComponent,
    FretboardComponent
  ]
})
export class CourseModule {
}
