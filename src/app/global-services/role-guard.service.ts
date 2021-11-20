import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { TokenStorageService } from '../modules/security/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  constructor(
    private tokenStorage: TokenStorageService,
    public router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.tokenStorage.userRole.value) {
      const expectedRole: string[] = route.data.expectedRole;
      const validRole: string | undefined = expectedRole.find(
        (role) => this.tokenStorage.userRole.value == role
      );;
      if (!validRole) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
