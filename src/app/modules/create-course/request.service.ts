import { CourseModel } from './model/course-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app-settings';
import { BasicInformationModel } from './basic-information/basic-information-model';
import { SectionModel } from './section-model';
import { LessonModel } from './lesson-model';
import { MyCourseModel } from './courses/my-courses-model';



@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http : HttpClient) { }


  sendBasicInformation(data: BasicInformationModel): Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT+'create-course/basic', data);
  }
  getCourse(title: string):Observable<CourseModel>{
    return this.http.get<CourseModel>(AppSettings.API_ENDPOINT+'course/'+title);
  }

  getLesson(id: number): Observable<LessonModel>{
    return this.http.get<LessonModel>(AppSettings.API_ENDPOINT+"create-course/section/"+id);
  }

  getVideoInLesson(lessonId: number): Observable<any>{

    return this.http.get<any>(AppSettings.API_ENDPOINT+"video/"+lessonId);
  }

  addSectionToCourse(courseId: number, section : SectionModel): Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT+'create-course/section/'+courseId,section);
  }
  addLessonToCourse(sectionid: number, lesson : LessonModel): Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT+'create-course/lesson/'+sectionid,lesson);
  }
  swapSection(sections: SectionModel[]): Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT+'create-course/section/swap',sections)
  }
  swapLesson(lessons: LessonModel[]): Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT+'create-course/lesson/swap',lessons) 
  }

  updateLesson(lesson: LessonModel): Observable<LessonModel> {
    return this.http.patch<LessonModel>(AppSettings.API_ENDPOINT+'create-course/lesson',lesson);
  }

  getMyCourses(): Observable<MyCourseModel[]> {
    return this.http.get<MyCourseModel[]>(AppSettings.API_ENDPOINT+'mycourses');
  }

  deleteCourse(myCourseDto: MyCourseModel): Observable<MyCourseModel[]> {
    return this.http.delete<MyCourseModel[]>(AppSettings.API_ENDPOINT+'course/delete',{body: myCourseDto});
  }

  changeCourseStatus(myCourseDto: MyCourseModel) {
    return this.http.patch(AppSettings.API_ENDPOINT+'course/status',myCourseDto);
  }
}
