import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import {WindowService} from 'src/app/global-services/window.service';
import { CourseService } from '../../service/course.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit, OnDestroy {
  panelOpenState: boolean = false;
  theatherMode: boolean = false;
  isMobile: boolean = this.device.isMobile();
  subscription: Subscription = new Subscription;

  constructor(
    private window: WindowService,
    private device: DeviceDetectorService,
    public courseService: CourseService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.window.theatherMode.subscribe(mode => {
      this.theatherMode = mode;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
