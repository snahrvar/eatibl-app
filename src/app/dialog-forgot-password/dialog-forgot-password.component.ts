import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dialog-forgot-password',
  templateUrl: './dialog-forgot-password.component.html',
  styleUrls: ['./dialog-forgot-password.component.scss']
})
export class DialogForgotPasswordComponent implements OnInit {

  emailForm: FormGroup;
  submitAttempt = false;
  emailSent = false;
  processing = false;
  response = {} as any;
  apiUrl = environment.apiURL;

  constructor(
    public dialogRef: MatDialogRef<DialogForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private http: HttpClient,
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
    else {
      this.processing = true;
      this.http.post(this.apiUrl + '/user/passwordReset', this.emailForm.value)
        .subscribe(
          res => {
            this.response = res;
            if(this.response.message == 'success'){
              this.processing = false;
              this.emailSent = true;
            }
          });
    }
  }

}
