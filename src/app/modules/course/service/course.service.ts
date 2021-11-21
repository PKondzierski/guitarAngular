import { Comment } from './../comment/comment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AppSettings } from 'src/app/app-settings';
import { LessonModel } from '../../create-course/lesson-model';
import { CourseModel } from '../../create-course/model/course-model';
import { ReferenceLesson } from '../../create-course/model/reference-lesson-model';
import { CourseInfo } from '../courses/courseInfo';
import { Note } from '../note/note';
import { Chord } from '../chord/chord';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) {}

  course?: CourseModel;
  actualLesson: Subject<LessonModel> = new Subject();
  actualTime: Subject<number> = new Subject();
  references: ReferenceLesson[] = [];
  notes: Note[] = [];
  comments: Comment[] = [];
  actualLessonTime: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  getCourseByName(name: string): Observable<CourseModel> {
    return this.http.get<CourseModel>(AppSettings.API_ENDPOINT+"course/"+name);
  }

  getCourses(): Observable<CourseInfo[]> {
    return this.http.get<CourseInfo[]>(AppSettings.API_ENDPOINT+"courses");
  }

  saveNote(note: Note): Observable<Note[]> {
    return this.http.post<Note[]>(AppSettings.API_ENDPOINT+"note", note);
  }

  saveComment(comment: Comment): Observable<Comment[]> {
    return this.http.post<Comment[]>(AppSettings.API_ENDPOINT+"comment", comment);
  }

  getNotesByLessonId(id: number): Observable<Note[]> {
    return this.http.get<Note[]>(AppSettings.API_ENDPOINT+"note/"+id);
  }
  getCommentsByLessonId(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(AppSettings.API_ENDPOINT+"comment/"+id);
  }

  setNotes(notes: Note[]) {
    this.notes = notes.sort((a:Note, b:Note) => a.time-b.time);
  }

  setComments(comments: Comment[]) {
    this.comments = comments;
  }
  getChords(): Observable<Chord[]> {
    return this.http.get<Chord[]>("https://guitar-kondzierski.herokuapp.com/music");
  }
}
