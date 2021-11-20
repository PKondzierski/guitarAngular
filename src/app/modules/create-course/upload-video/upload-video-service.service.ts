import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSettings } from 'src/app/app-settings';
import { LessonModel } from '../lesson-model';

@Injectable({
  providedIn: 'root'
})
export class UploadVideoServiceService {

  constructor(private http: HttpClient) {}

  
  addVideo(video: File, lesson: LessonModel): Observable<any> {
    var formData: any = new FormData();
    formData.append("file", video);
    return this.http.post(AppSettings.API_ENDPOINT+'upload/'+lesson.id, formData,{
      reportProgress: true,
      observe: 'events'
    });
  }

  // errorMgmt(error: HttpErrorResponse) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     // Get client-side error
  //     errorMessage = error.error.message;
  //   } else {
  //     // Get server-side error
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   console.log(errorMessage);
  //   return throwError(errorMessage);
  // }
}