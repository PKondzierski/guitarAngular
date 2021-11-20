import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import {WindowService} from '../../../global-services/window.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit, OnDestroy {

  theatherMode: boolean = false;
  isMobile: boolean = this.device.isMobile();
  subscription: Subscription = new Subscription;
  constructor(private window: WindowService, private device: DeviceDetectorService) {
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
