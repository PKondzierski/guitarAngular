import {Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/modules/security/token-storage.service';

@Component({
  selector: 'app-static-navbar',
  templateUrl: './static-navbar.component.html',
  styleUrls: ['./static-navbar.component.scss']
})
export class StaticNavbarComponent implements OnInit {

  subscription: Subscription = new Subscription;
  role?: string;
  LECTURER: string = 'Wykładowca';
  ADMIN: string = 'Admin';

  constructor(public tokenStorage: TokenStorageService) {

  }

  ngOnInit(): void {
    this.tokenStorage.userRole.subscribe((role: string) => this.role = role);
  }


}
