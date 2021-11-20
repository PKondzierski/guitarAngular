import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from './register/register.component';
import {MaterialModule} from 'src/app/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { authInterceptorProviders } from './auth-interceptor';
import { TokenStorageService } from './token-storage.service';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SharingModule } from '../sharing-module/sharing.module';

export function appSaveRole(tokenStorage: TokenStorageService) {
  return () => tokenStorage.saveRole();
}

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    AdminPanelComponent
    ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharingModule
  ],
  providers: [authInterceptorProviders,
  {
    provide: APP_INITIALIZER,
    useFactory: appSaveRole,
    deps: [TokenStorageService],
    multi: true
  }],
  exports: [
    RegisterComponent
  ]
})
export class SecurityModule {
}

