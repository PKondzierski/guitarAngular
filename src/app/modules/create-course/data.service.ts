import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CourseModule } from '../course/course.module';
import { CourseModel } from './model/course-model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  course: Subject<CourseModel> = new Subject();
  sectionMenu: Subject<any> = new Subject();
  constructor() { }
}
