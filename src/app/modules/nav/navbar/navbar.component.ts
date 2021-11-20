import {Component, OnDestroy, OnInit} from '@angular/core';
import {Theme} from '../../enum/theme';
import {ThemeChangerService} from '../../../global-services/theme-changer.service';
import {WindowService} from '../../../global-services/window.service';

import {SlideInOutAnimation} from './animations';
import { DataService } from '../../create-course/data.service';
import { PanelService } from '../../create-course/panel/panel.service';
import { LessonModel } from '../../create-course/lesson-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [SlideInOutAnimation]

})
export class NavbarComponent implements OnInit, OnDestroy {
  dropDownMenu: boolean = false;
  mobileDevice: boolean = false;
  showLogo: boolean = true;
  showMenu: boolean = false;
  sectionMenu: any; 
  lessonActive: boolean = false; 
  subscription: Subscription = new Subscription;
  role: string = 'admin';

  constructor(
    private themeService: ThemeChangerService,
    private window: WindowService, 
    private dataService: DataService, 
    public panelService: PanelService) {
  }

  ngOnInit(): void {
    this.onResize(window.innerWidth);
    this.subscription.add(this.window.getWindowWidth.subscribe(value => {
      this.onResize(value);
    }));
    this.subscription.add(this.dataService.sectionMenu.subscribe((menu)=>{
      if(menu){
        this.showLogo=false;
        this.showMenu=true;
        this.sectionMenu = menu;
      }
      else{
        this.showLogo=true;
        this.showMenu=false;
      }
    }));

    this.subscription.add(this.panelService.actualLesson.subscribe((lesson: LessonModel)=>{
      lesson ? this.lessonActive=true : this.lessonActive = false;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onResize(value: Number) {
    value < 162 ? this.showLogo = false : this.showLogo = true;
    value < 699 ? this.mobileDevice = true : this.mobileDevice = false;
  }


  changeTheme(): void {
    if (this.themeService.getTheme === Theme.LIGHT)
      this.themeService.changeTheme(Theme.DARK);
    else
      this.themeService.changeTheme(Theme.LIGHT);
  }

}
