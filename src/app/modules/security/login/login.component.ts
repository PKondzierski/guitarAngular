import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../security.service';
import { TokenStorageService } from '../token-storage.service';
import { Login } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  passwordHidden: boolean = true;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  badCredentials: string = '';

  constructor(private http: SecurityService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.loginForm.markAllAsTouched;
    if (this.loginForm.valid) {
      const login: Login = {
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value
      }
    this.http.login(login).subscribe((response) => {
      this.tokenStorage.saveTokenAndRole(response.headers.get('Authorization'));
      this.router.navigate(['courses']);
    }, (error) => {
      this.badCredentials = 'Błędne dane lub konto nieaktywne';
    });
    }
  }

  getUsernameError(): string {
    let error = this.loginForm.get('username');

    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
    }
    return '';
  }

  getPasswordError(): string {
    let error = this.loginForm.get('password');

    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
    }
    return '';
  }


}
