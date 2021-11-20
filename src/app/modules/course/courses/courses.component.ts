import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, _MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CourseService } from '../service/course.service';
import { CourseInfo } from './courseInfo';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {

  courses: CourseInfo[] = [];
  displayedColumns: string[] = ['id', 'Kurs', 'Autor', 'Liczba lekcji'];
  dataSource!: MatTableDataSource<CourseInfo>;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: CourseInfo[]) => {
      this.courses = courses;
      this.dataSource = new MatTableDataSource<CourseInfo>(this.courses);
      this.setPaginator();
    })
  }

  setPaginator() {
    if (this.paginator)
     this.dataSource!.paginator = this.paginator;
  }

  filter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLocaleLowerCase();
  }

  getCourse(course: CourseInfo) {
    this.router.navigate(['course/'+course.name]);
  }
}
