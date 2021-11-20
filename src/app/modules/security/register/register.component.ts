import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { HomeComponent } from 'src/app/components/home/home.component';
import { SecurityService } from '../security.service';
import { User } from './register';
import { Role } from './role';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  passwordHidden: boolean = true;
  repeatPasswordHidden: boolean = true;
  submitDisabled: boolean = true;
  subscription: Subscription = new Subscription;
  roles: Role[] = [];
  role?: Role;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  //Password requirment
  passRequirement = {
    passwordMinLowerCase: 1,
    passwordMinNumber: 1,
    passwordMinSymbol: 1,
    passwordMinUpperCase: 1,
    passwordMinCharacters: 8
  };
  passwordPattern = [
    `(?=([^a-z]*[a-z])\{${this.passRequirement.passwordMinLowerCase},\})`,
    `(?=([^A-Z]*[A-Z])\{${this.passRequirement.passwordMinUpperCase},\})`,
    `(?=([^0-9]*[0-9])\{${this.passRequirement.passwordMinNumber},\})`,
    `(?=(\.\*[\$\@\$\!\%\*\?\&])\{${
      this.passRequirement.passwordMinSymbol
    },\})`,
    `[A-Za-z\\d\$\@\$\!\%\*\?\&\.]{${
      this.passRequirement.passwordMinCharacters
    },}`
  ].map(item => item.toString())
    .join("");

  //

  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.passwordPattern)
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      this.passwordMatch.bind(this)]
    ),
    username: new FormControl(''),
    motivation: new FormControl(null),
    role: new FormControl(null, [Validators.required])
  });

  constructor(
    private http: SecurityService,
    private route: Router) {
  }

  ngOnInit(): void {
    this.subscription.add(this.http.getRoles().subscribe((roles: Role[]) => {
      this.roles = roles;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      const user: User = {
        email: this.registerForm.controls.email.value,
        username: this.registerForm.controls.username.value,
        firstname: this.registerForm.controls.firstname.value,
        lastname: this.registerForm.controls.lastname.value,
        password: this.registerForm.controls.password.value,
        motivation: this.registerForm.controls.motivation.value,
        role: this.registerForm.controls.role.value
      }
      this.http.register(user).pipe((finalize(() => {
        // this.route.navigate(['/'])
      }))).subscribe(()=>{
        console.log("send");
      });
      
    }
  }

  getEmailError(): string {
    let error = this.registerForm.get('email');

    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
      return error.hasError('email') ? 'Niepoprawny email' : '';
    }
    return '';
  }

  getPasswordRepeatError(): string {
    let error = this.registerForm.get('repeatPassword');
    if (error != null)
      return error.hasError('passwordDoesntMatch') ? 'Hasła nie są identyczne' : '';
    return '';
  }

  passwordMatch(control: FormControl): { [s: string]: boolean } | null {
    if (this.registerForm != undefined) {
      if (this.registerForm.get('password')!.value === control.value)
        return null;
    }
    return {'passwordDoesntMatch': true};
  }

  getPasswordError(): string {
    let error = this.registerForm.get('password');
    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
      if (error.hasError('minlength')) return 'Hasło jest zbyt krótkie';
      return error.hasError('pattern') ? 'Hasło jest zbyt słabe' : '';
    }
    return '';
  }
}
