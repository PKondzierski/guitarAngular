import {Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/modules/security/token-storage.service';

@Component({
  selector: 'app-dropdown-navbar',
  templateUrl: './dropdown-navbar.component.html',
  styleUrls: ['./dropdown-navbar.component.scss']
})
export class DropdownNavbarComponent implements OnInit {
  subscription: Subscription = new Subscription;
  LECTURER: string = 'Wykładowca';
  ADMIN: string = 'Admin';
  role?: string;
  constructor(public tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.tokenStorage.userRole.subscribe((role: string) => this.role = role));
  }

}
