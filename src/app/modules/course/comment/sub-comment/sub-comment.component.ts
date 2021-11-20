import { Comment } from './../comment';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-comment',
  templateUrl: './sub-comment.component.html',
  styleUrls: ['./sub-comment.component.scss']
})
export class SubCommentComponent implements OnInit {


  @Input() comment?: Comment;

  constructor() { }

  ngOnInit(): void {
  }

}
