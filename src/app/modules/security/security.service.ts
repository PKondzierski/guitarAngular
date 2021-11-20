import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from './login/login';
import { User } from './register/register';
import { Role } from './register/role';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  ENDPOINT='http://localhost:8080';

  constructor(private http: HttpClient) { }

  register(user: User): Observable<void> {
    return this.http.post<void>(this.ENDPOINT+'/register', user);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.ENDPOINT+'/roles');
  }

  login(login: Login): Observable<any> {
    let contentHeader = new HttpHeaders({ "Content-Type":"application/json" });
    return this.http.post<any>(this.ENDPOINT+'/login', login, { headers: contentHeader, observe: 'response' });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.ENDPOINT+'/users');
  }

  changeUserStatus(user: User) {
    return this.http.post(this.ENDPOINT+'/changeStatus', user);
  }

}

