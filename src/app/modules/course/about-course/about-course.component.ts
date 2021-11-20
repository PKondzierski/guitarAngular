import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowService } from 'src/app/global-services/window.service';
import { CourseService } from '../service/course.service';

@Component({
  selector: 'app-about-course',
  templateUrl: './about-course.component.html',
  styleUrls: ['./about-course.component.scss']
})
export class AboutCourseComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  isTheather: boolean = false;
  constructor(
    public courseService: CourseService,
    private windowService: WindowService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.windowService.theatherMode.subscribe((mode: boolean) => {
      this.isTheather = mode;
    }))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
