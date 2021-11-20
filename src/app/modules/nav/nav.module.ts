import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {DropdownNavbarComponent} from './navbar/dropdown-navbar/dropdown-navbar.component';
import {StaticNavbarComponent} from './navbar/static-navbar/static-navbar.component';
import {MaterialModule} from 'src/app/material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    NavbarComponent,
    DropdownNavbarComponent,
    StaticNavbarComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule

  ],
  exports: [
    NavbarComponent
  ]
})
export class NavModule {
}
