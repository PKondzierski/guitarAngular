import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../request.service';
import { MyCourseModel } from './my-courses-model';

@Component({
  selector: 'app-mycourses',
  templateUrl: './mycourses.component.html',
  styleUrls: ['./mycourses.component.scss']
})
export class MyCoursesComponent implements OnInit {

  courses: MyCourseModel[] = [];
  toDelete:boolean[] = [];

  constructor(private http: RequestService, private route: Router) { }

  ngOnInit(): void {
    this.http.getMyCourses().subscribe((courses: MyCourseModel[]) => {
      this.courses = courses;
    })

  }
  markDelete(index: number) {
    this.toDelete[index] = true;
  }
  
  edit(course: MyCourseModel) {
    this.route.navigateByUrl("panel/"+course.name);
  }
  
  delete(course: MyCourseModel) {
    console.log('delted')
    this.http.deleteCourse(course).subscribe((courses: MyCourseModel[]) => this.courses = courses);
  }
}
