import { LessonModel } from './../../create-course/lesson-model';
import { Subscription } from 'rxjs';
import { WindowService } from 'src/app/global-services/window.service';
import { CourseService } from './../service/course.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Comment } from './comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {

  isTheather: boolean = false;
  subscription: Subscription = new Subscription();
  expanded: boolean[] = [];
  newComment: string = '';
  newAnswer: string = '';
  lesson?: LessonModel;
  constructor(
    public courseService: CourseService,
    private windowService: WindowService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.windowService.theatherMode.subscribe((mode: boolean) => {
      this.isTheather = mode;
    }));

    this.courseService.actualLesson.subscribe((lesson:LessonModel) => this.lesson = lesson);
  }

  addComment() {
    if (this.newComment) {
      const newComment: Comment = {
        id: undefined,
        lessonId: this.lesson!.id,
        username: undefined,
        created: undefined,
        comment: this.newComment,
        mainCommentId: undefined,
        subComments: undefined
      }
      this.courseService.saveComment(newComment).subscribe((comments: Comment[]) => {
        this.courseService.setComments(comments);
        this.newComment = '';
      })
    }
  }

  addAnswer(comment: Comment ) {
    if (this.newAnswer && comment.id != undefined && comment.id>=0) {
      const answer: Comment = {
        id: undefined,
        lessonId: this.lesson!.id,
        username: undefined,
        created: undefined,
        comment: this.newAnswer,
        mainCommentId: comment.id,
        subComments: undefined
      }
      this.courseService.saveComment(answer).subscribe((comments: Comment[]) => {
        this.courseService.setComments(comments);
        this.newAnswer = '';
      })
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
