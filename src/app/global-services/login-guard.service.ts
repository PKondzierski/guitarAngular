import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { TokenStorageService } from '../modules/security/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
  constructor(
    private tokenStorage: TokenStorageService,
    public router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.tokenStorage.userRole.value) {
      this.router.navigate(['courses']);
    }
    return true;
  }
}
