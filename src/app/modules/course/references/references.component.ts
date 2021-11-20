import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowService } from 'src/app/global-services/window.service';
import { LessonModel } from '../../create-course/lesson-model';
import { ReferenceLesson } from '../../create-course/model/reference-lesson-model';
import { CourseService } from '../service/course.service';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss']
})
export class ReferencesComponent implements OnInit, OnDestroy {

  constructor(
    public courseService: CourseService,
    private windowService: WindowService) { }
  subscription: Subscription = new Subscription();
  references: ReferenceLesson[] = [];
  isTheather: boolean = false;

  ngOnInit(): void {
    this.subscription.add(this.windowService.theatherMode.subscribe((mode: boolean) => {
      this.isTheather = mode;
    }))
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  jumpToTimeByReference(reference: ReferenceLesson) {
    this.courseService.actualTime.next(reference.begin);

  }

}
