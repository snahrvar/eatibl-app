import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogForgotPasswordComponent } from '../dialog-forgot-password/dialog-forgot-password.component';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-register-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  contentLoaded = false; //Prevent content from loading until api calls are returned
  apiUrl = environment.apiURL;
  user = {
    email: '',
    password: ''
  };
  response = {} as any;
  loginForm: FormGroup;
  submitAttempt = false;
  badInput = false;
  confirmDialogRef: MatDialogRef<DialogForgotPasswordComponent>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.contentLoaded = true;
    //Form controls and validation
    this.loginForm = this.formBuilder.group({
      email: ['',  Validators.required],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(data => {
      this.badInput = false;
    })
  }

  ngOnInit() {}

  //Open forgot password dialog
  forgotPassword(){
    //console.log(booking._id);
    this.confirmDialogRef = this.dialog.open(DialogForgotPasswordComponent, {});
  }

  submitLogin(){
    if(!this.loginForm.valid){
      Object.keys(this.loginForm.controls).forEach(field => { // {1}
        const control = this.loginForm.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      this.submitAttempt = true;
    }
    else{
      this.http.post(this.apiUrl + '/token', this.loginForm.value)
        .subscribe(
          res => {
            this.response = res;

            if(this.response.message == 'not found'){
              this.badInput = true;
            }
            else{
              localStorage.setItem('token',JSON.stringify(res).replace(/['"]+/g, '')); //add token to localStorage so we can detect verified user
              var userData = decode(localStorage.getItem('token'));

              if(userData.type == "Restaurant") // for restaurants
                this.router.navigate(['/restaurant/' + userData.restaurant_fid + '/bookings']);
              if(userData.type == "Admin") // for admins
                this.router.navigate(['/restaurantList'])
            }
          },
          err => {
            console.log(err);
          }
        );
    }
  }

}
