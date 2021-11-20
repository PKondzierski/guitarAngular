import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import {WindowService} from 'src/app/global-services/window.service';
import { CourseModel } from '../create-course/model/course-model';
import { CourseService } from './service/course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {
  flexSizeVideo: number = 70;
  flexSizePanel: number = 30;
  flexDirection: string = 'row';
  theatherMode: boolean = false;
  isMobile: boolean = this.device.isMobile();
  subscription: Subscription = new Subscription();
  smallDevice:boolean = false;
  lastWidth: boolean = false;

  constructor(private window: WindowService,
     private device: DeviceDetectorService,
     public courseService: CourseService,
     private route: ActivatedRoute,
     private router: Router) {
  }

  ngOnInit(): void {
    this.handleTheatherMode();
    this.setPanels(window.innerWidth);
    
    this.subscription.add(this.window.windowWidth.subscribe((width:Number)=> {
      this.setPanels(width);
    }))
    
    let title: string = this.route.snapshot.params['title'];
    this.getCourse(title);
    
  }

  handleTheatherMode() {
    this.subscription.add(this.window.theatherMode.subscribe(mode => {
      this.theatherMode = mode;
      this.changeTheatherFlex()
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCourse(title: string) {
    this.courseService.getCourseByName(title).subscribe((course: CourseModel)=>{
      this.courseService.course = course;
      if (course.sections && course.sections[0].lessons) {
        this.courseService.actualLesson.next(course.sections[0].lessons[0]);
      }
    }, (error) => this.router.navigateByUrl(''));
  }

  changeTheatherFlex() {
    if (this.theatherMode) {
      this.flexSizeVideo = 100;
      this.flexSizePanel = 100;
      this.flexDirection = 'column';
      this.smallDevice = true;
    }  else {
      this.setPanels(window.innerWidth);
    }
  }

  setPanels(width: Number) {
    if (width < 1300) {
      this.theatherMode = false;
      // this.window.theatherMode.next(false);
      this.smallDevice = true;
      this.flexSizeVideo = 100;
      this.flexSizePanel = 100;
      this.flexDirection = 'column';
    } else if (width>=1300 && !this.theatherMode) {
      this.smallDevice = false;
      this.flexSizeVideo = 70;
      this.flexSizePanel = 30;
      this.flexDirection = 'row'
    }
  }
}
