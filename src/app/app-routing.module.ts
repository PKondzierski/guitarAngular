import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CourseComponent} from './modules/course/course.component';
import {HomeComponent} from './components/home/home.component';
import {RegisterComponent} from './modules/security/register/register.component';
import {BasicInformationComponent} from './modules/create-course/basic-information/basic-information.component';
import {PanelComponent} from './modules/create-course/panel/panel.component';
import { LoginComponent } from './modules/security/login/login.component';
import { RoleGuardService } from './global-services/role-guard.service';
import { CoursesComponent } from './modules/course/courses/courses.component';
import { LoginGuardService } from './global-services/login-guard.service';
import { MyCoursesComponent } from './modules/create-course/courses/mycourses.component';
import { AdminPanelComponent } from './modules/security/admin-panel/admin-panel.component';

const ADMIN: string = 'Admin';
const STUDENT: string = 'Kursant';
const LECTURER: string = 'Wykładowca';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [LoginGuardService]
  },
  {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuardService]
  },
  {
    path: 'course/:title',
    component: CourseComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: [ADMIN, LECTURER, STUDENT]
    }
  },
  {
    path: 'basic',
    component: BasicInformationComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: [ADMIN, LECTURER]
    }
  },
  {
    path: 'panel/:title',
    component: PanelComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: [ADMIN, LECTURER]
    }
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: [ADMIN, LECTURER, STUDENT]
    }
  },

  {
    path: 'mycourses',
    component: MyCoursesComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: [LECTURER, ADMIN]
    }
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRole: [ADMIN]
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
