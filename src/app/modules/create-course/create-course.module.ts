import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicInformationComponent} from './basic-information/basic-information.component';
import {MaterialModule} from 'src/app/material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PanelComponent} from './panel/panel.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CourseModule } from '../course/course.module';
import { SectionComponent } from './panel/section/section.component';
import { SectionDialogComponent } from './section-dialog/section-dialog.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { VideoComponent } from './panel/video/video.component';
import { VimeModule } from '@vime/angular';
import { LessonComponent } from './panel/lesson/lesson.component';
import { ChordComponent } from './panel/chord/chord.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { DragAndDropDirective } from './upload-video/drag-and-drop.directive';
import { SharingModule } from '../sharing-module/sharing.module';
import { MyCoursesComponent } from './courses/mycourses.component';
@NgModule({
  declarations: [
    BasicInformationComponent,
    PanelComponent,
    SectionComponent,
    SectionDialogComponent,
    VideoComponent,
    LessonComponent,
    ChordComponent,
    UploadVideoComponent,
    DragAndDropDirective,
    MyCoursesComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    AppRoutingModule,
    CourseModule,
    VimeModule,
    SharingModule    
  ],
  exports: [
    PanelComponent,
    MyCoursesComponent
  ],
  entryComponents:[
    SectionComponent,SectionDialogComponent
  ],

})
export class CreateCourseModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('dark-theme');
}
}
