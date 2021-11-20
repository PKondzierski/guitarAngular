import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseModel } from '../model/course-model';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit, OnDestroy {

  basicInformationGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    aboutAuthor: new FormControl('')
  });
  submitDisabled: boolean = true;
  responseError: String = '';
  subscription: Subscription = new Subscription;


  constructor(private http: RequestService
    ,private route : Router) {
  }

  ngOnInit(): void {
    this.subscription.add(this.basicInformationGroup.statusChanges.subscribe(status => {
      if (status === "INVALID")
        this.submitDisabled = true;
      else
        this.submitDisabled = false;
    }));
  }

  save(): void {
    this.http.sendBasicInformation(this.basicInformationGroup.value).subscribe((response: CourseModel) => {
      this.responseError = '';
      this.route.navigate(['/panel/'+response.title]);
    }, (error) => {
      this.responseError = error.error;
    })
  }

  getTitleError(): string {
    let error = this.basicInformationGroup.get('title');
    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
    }
    return '';
  }
  getDescriptionError(): string {
    let error = this.basicInformationGroup.get('description');
    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
    }
    return '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
