import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {Theme} from './modules/enum/theme';
import {ThemeChangerService} from './global-services/theme-changer.service';
import {WindowService} from './global-services/window.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  theme: Theme = Theme.LIGHT;
  lightTheme: Theme = Theme.LIGHT;
  subscription: Subscription = new Subscription();

  @HostListener('window:resize')
  onResize() {
    this.window.updateWindow(window.innerWidth, window.innerHeight);
  }


  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private themeService: ThemeChangerService,
    private window: WindowService) {
    this.matIconRegistry.addSvgIcon(
      'logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/svg/guitarLogo.svg")
    )
    this.matIconRegistry.addSvgIcon(
      'add_circle_outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/svg/add_circle_outline.svg")

    )
  }

  ngOnInit() {
    this.subscription.add(this.themeService.getThemeSubject.subscribe(theme => {
      this.theme = theme;
    }));
    this.window.updateWindow(window.innerWidth, window.innerHeight);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
