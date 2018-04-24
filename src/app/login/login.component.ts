import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-register-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  contentLoaded = false; //Prevent content from loading until api calls are returned
  apiUrl = environment.apiURL;
  loginForm: FormGroup;
  submitAttempt = false;
  response = {} as any;
  badInput = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public userService: UserService, private formBuilder: FormBuilder) {
    this.contentLoaded = true;
    //Form controls and validation
    this.loginForm = this.formBuilder.group({
      email: ['',  Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

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
                console.log(userData)
                this.router.navigate(['/restaurant/' + userData.restaurant_fid + '/bookings']);
              if(userData.type == "Admin") // for admins
                this.router.navigate(['/'])
            }
          },
          err => {
            console.log(err);
          }
        );
    }
  }

}
