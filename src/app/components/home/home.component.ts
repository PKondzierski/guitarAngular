import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {RegisterAnimation} from './homeAnimation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [RegisterAnimation]
})
export class HomeComponent implements OnInit, AfterViewInit {
  registerButton: string = 'out';
  loaded: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    setTimeout(() => this.registerButton = 'in', 200);
  }

  homePage() {
    this.router.navigate(['/']);
  }


}
