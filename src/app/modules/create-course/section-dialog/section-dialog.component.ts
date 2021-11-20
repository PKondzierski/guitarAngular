import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-section-dialog',
  templateUrl: './section-dialog.component.html',
  styleUrls: ['./section-dialog.component.scss']
})
export class SectionDialogComponent implements OnInit {


  



  constructor(public dialogRef: MatDialogRef<SectionDialogComponent>, @Inject(MAT_DIALOG_DATA) public sectionGroup: [FormGroup,string]) { 

  }

  ngOnInit(): void {

  }

  getTitleError(): string {
    let error = this.sectionGroup[0].get('name');
    if (error != null) {
      if (error.hasError('required')) return 'Proszę uzupełnić pole';
    }
    return '';
  }
}
