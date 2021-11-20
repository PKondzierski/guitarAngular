import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NavModule} from './modules/nav/nav.module';

import {HomeComponent} from './components/home/home.component';
import {SecurityModule} from './modules/security/security.module';
import {CourseModule} from './modules/course/course.module';
import {CreateCourseModule} from './modules/create-course/create-course.module';
import { MatDialogModule } from '@angular/material/dialog';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NavModule,
    SecurityModule,
    AppRoutingModule,
    CourseModule,
    CreateCourseModule,
    MatDialogModule

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
