import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

const AUTHORIZATION_KEY = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  userRole: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  saveTokenAndRole(token: string) { 
    window.sessionStorage.removeItem(AUTHORIZATION_KEY);
    window.sessionStorage.setItem(AUTHORIZATION_KEY, token);
    this.saveRole();
  }

  saveRole() {
    const token: string | null = this.getToken();
    if (token) {
      const jwtData: string = token.split('.')[1];
      const decodedData = JSON.parse(this.b64DecodeUnicode(jwtData));
      this.userRole.next(decodedData.authorities[0].authority.split('_')[1]);
    }
  }

  b64DecodeUnicode(token: string) {
    return decodeURIComponent(Array.prototype.map.call(atob(token), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}

  getToken(): string | null {
      return window.sessionStorage.getItem(AUTHORIZATION_KEY);
  }

  logout() {
    this.userRole.next('');
    window.sessionStorage.removeItem(AUTHORIZATION_KEY);
    window.location.reload();
  }

}
