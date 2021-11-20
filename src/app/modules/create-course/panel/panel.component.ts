import { CourseModel } from '../model/course-model';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../request.service';
import { DOCUMENT } from '@angular/common';
import { DataService } from '../data.service';
import { PanelService } from './panel.service';
import { LessonModel } from '../lesson-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, AfterViewInit, OnDestroy {
  course?: CourseModel;
  document: Document;
  lesson?: LessonModel;
  @ViewChild('sectionMenu') sectionMenu: any; 

  constructor(
    private route: ActivatedRoute,
    private http: RequestService,
    private dataService: DataService,
    private panelService: PanelService,
    @Inject(DOCUMENT) document: Document,
  ) {
    this.document = document;
  }
  subscription: Subscription = new Subscription;


  ngOnInit(): void {
    let title: string = this.route.snapshot.params['title'];
    this.http.getCourse(title).subscribe((data) => {
      this.dataService.course.next(data);
    });
    this.subscription.add(this.panelService.actualLesson.subscribe((lesson: LessonModel)=>{
      this.lesson = lesson;      
    }));
  }
  
  ngAfterViewInit(): void{
    this.dataService.sectionMenu.next(this.sectionMenu);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
