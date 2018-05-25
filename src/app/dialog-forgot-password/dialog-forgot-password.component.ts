import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dialog-forgot-password',
  templateUrl: './dialog-forgot-password.component.html',
  styleUrls: ['./dialog-forgot-password.component.scss']
})
export class DialogForgotPasswordComponent implements OnInit {

  emailForm: FormGroup;
  submitAttempt = false;

  constructor(
    public dialogRef: MatDialogRef<DialogForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', Validators.email]
    });
  }

  ngOnInit() {
  }

  submitEmail(){
    //Check if form has errors
    if(this.emailForm['controls'].email.hasError('email'))
      this.submitAttempt = true;
    else
      this.dialogRef.close(this.emailForm.value);
  }

}
