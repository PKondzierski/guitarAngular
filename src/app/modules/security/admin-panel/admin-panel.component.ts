import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../course/service/course.service';
import { MyCourseModel } from '../../create-course/courses/my-courses-model';
import { RequestService } from '../../create-course/request.service';
import { User } from '../register/register';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  users: User[] = [];
  courses: MyCourseModel[] = [];
  toDelete:boolean[] = [];
  sortedByActive?: boolean = undefined;

  constructor(private securityService: SecurityService,
    private courseSerivce: RequestService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.securityService.getUsers().subscribe((users: User[]) => this.users = users);
    this.courseSerivce.getMyCourses().subscribe((courses: MyCourseModel[]) => this.courses = courses);
  }
  markDelete(index: number) {
    this.toDelete[index] = true;
  }

  delete(course: MyCourseModel) {
    this.courseSerivce.deleteCourse(course).subscribe((courses: MyCourseModel[]) => this.courses = courses);
  }

  changeCourseStatus(course: MyCourseModel) {
    this.courseSerivce.changeCourseStatus(course).subscribe(() => {
      course.enabled = !course.enabled
    }, () => {});
  }

  checkCourse(course: MyCourseModel) {
      this.router.navigateByUrl('course/' + course.name);
  }
  
  changeUserStatus(user: User) {
    this.securityService.changeUserStatus(user).subscribe(() => {
      user.enabled = !user.enabled;
    }, () => {});
  }

  sortByActive() {
    console.log(this.sortedByActive);
    if (this.sortedByActive === undefined) {
      this.sortedByActive = false;
    }

    if (this.sortedByActive != undefined) {
      this.sortedByActive = !this.sortedByActive;
    }
    this.users.sort((a,b) => {
      if (a.enabled != undefined && b.enabled != undefined) {
        if (this.sortedByActive) {
          return Number(a.enabled) - Number(b.enabled);
        } else {
          return Number(b.enabled) - Number(a.enabled);
        }
      } else {
        return 0;
      }
    });
  }
}
