import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { LessonModel } from '../lesson-model';
import { PanelService } from '../panel/panel.service';
import { RequestService } from '../request.service';
import { UploadVideoServiceService } from './upload-video-service.service';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss'],
})
export class UploadVideoComponent implements OnInit, OnDestroy {
  lesson?: LessonModel;
  videoForm: FormGroup = new FormGroup({
    video: new FormControl(null, Validators.required),
  });
  fileBytesText: string = '';
  progress: number = 0;
  subscription: Subscription = new Subscription;

  constructor(
    private panelService: PanelService,
    private fb: FormBuilder,
    private uploadService: UploadVideoServiceService,
    private http: RequestService
  ) {}

  ngOnInit(): void {
      this.subscription.add(this.panelService.actualLesson.subscribe((lesson: LessonModel) => {
        this.lesson = lesson;
      }));
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  uploadVideo(event: any) {
    let file = null
    if(event.files)
      file = event.files[0];
    else
      file = event[0];
    this.videoForm.patchValue({
      video: file,
    });
    this.fileBytesText = this.formatBytes(file.size);
  }
  submitVideo() {
    if (this.lesson && this.lesson.id){
      this.subscription.add(this.uploadService
        .addVideo(this.videoForm.get('video')?.value, this.lesson)
        .subscribe((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              if (event.total)
                this.progress = Math.round((event.loaded / event.total) * 100);
              break;
              case HttpEventType.Response:
                if(this.lesson)
                  this.http.getLesson(this.lesson.id).subscribe((lessonModel: LessonModel)=>{
                    this.lesson = this.lesson;
                    this.panelService.actualLesson.next(lessonModel);
                    this.panelService.chords.next(lessonModel.chords);
                    this.panelService.videoUploaded.next(lessonModel);
                })
                break;
              
          }
        }));}
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 Bitów';
    }
    const k = 1024;
    const dm = 2 <= 0 ? 0 : 2 || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onFileDropped(event : any){
    if(this.validDroppedFile(event[0]))
      this.uploadVideo(event);
  }

  validDroppedFile(file: File): boolean{
    if(file.type == 'video/mp4')
      return true;
    return false;
  }

  deleteFile(): void {
    this.videoForm.patchValue({
      video: null
    })
  }
}
