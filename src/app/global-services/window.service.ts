import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  windowWidth: Subject<Number> = new Subject();
  windowHigh: Subject<Number> = new Subject();
  theatherMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }


  updateWindow(width: number, height: number): void {
    this.windowWidth.next(width);
    this.windowHigh.next(height);

  }

  get getWindowWidth(): Subject<Number> {
    return this.windowWidth;
  }

  get getWindowHeight(): Subject<Number> {
    return this.windowHigh;
  }
}
