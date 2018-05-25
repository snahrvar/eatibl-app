import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogForgotPasswordComponent } from '../dialog-forgot-password/dialog-forgot-password.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private sub: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  resetPasswordForm: FormGroup;
  submitAttempt = false;
  badInput = false;
  response = {} as any;
  apiUrl = environment.apiURL;
  token: any;
  confirmDialogRef: MatDialogRef<DialogForgotPasswordComponent>;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route:ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.contentLoaded = true;
    //Form controls and validation
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['',  Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
      confirmPassword: ['', Validators.compose([ Validators.required, this.passwordMatch ])]
    });
  }

  ngOnInit() {
    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.token = params['token'];
    });
  }

  //When input changes clear errors
  clearErrors(){
    this.submitAttempt = false;
  }

  //Custom vaildator for password match
  passwordMatch(input: FormControl){
    //Error handling? From stack overflow
    if (!input.root || !input.root['controls']){
      return null;
    }

    //Returns true if passwords do not match
    var newPassword = input.root['controls'].newPassword.value;
    var confirmPassword = input.root['controls'].confirmPassword.value;
    if(newPassword.length > 0 && confirmPassword.length > 0 && newPassword != confirmPassword)
      return { passwordMatch: true };
    else
      return null;
  }

  //Submit the new password
  submitPassword(){
    if(!this.resetPasswordForm.valid){ //Mark all fields as touched if form is invalid to show errors
      Object.keys(this.resetPasswordForm.controls).forEach(field => { // {1}
        const control = this.resetPasswordForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.submitAttempt = true;
    }
    else{
      this.http.post(this.apiUrl + '/user/setRecoveryPassword/' + this.token, {'newPass': this.resetPasswordForm.value.newPassword})
        .subscribe(
          res => {
            this.response = res;
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  //Open forgot password dialog
  forgotPassword(){
    this.confirmDialogRef = this.dialog.open(DialogForgotPasswordComponent);
  }

}
