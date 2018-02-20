import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http'
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
  user = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public userService: UserService) {
    this.contentLoaded = true;
  }

  ngOnInit() {}

  submitLogin(){
    this.http.post(this.apiUrl + '/token', this.user)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token',JSON.stringify(res).replace(/['"]+/g, '')); //add token to localStorage so we can detect verified user
          var userData = decode(localStorage.getItem('token'));
          console.log(userData);

          if(userData.type == "Restaurant") // for restaurants
            this.router.navigate(['/restaurant/' + userData.restaurant_fid + '/bookings']);
          if(userData.type == "Admin") // for admins
            this.router.navigate(['/'])
        },
        err => {
          console.log(err);
        }
      );
  }

}
