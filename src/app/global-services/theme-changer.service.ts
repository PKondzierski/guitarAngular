import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Theme} from '../modules/enum/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeChangerService {

  private theme: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(Theme.LIGHT);

  constructor() {
  }


  changeTheme(value: Theme): void {
    this.theme.next(value);
  }

  get getTheme(): Theme {
    return this.theme.value;
  }

  get getThemeSubject(): BehaviorSubject<Theme> {
    return this.theme;
  }
}
