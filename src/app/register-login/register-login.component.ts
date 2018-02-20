import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss']
})
export class RegisterLoginComponent implements OnInit {
  contentLoaded = false; //Prevent content from loading until api calls are returned
  apiUrl = environment.apiURL;
  user = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.contentLoaded = true;
  }

  ngOnInit() {}

  submitLogin(){
    this.http.post(this.apiUrl + '/token', this.user)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token',JSON.stringify(res).replace(/['"]+/g, '')); //add token to localStorage so we can detect verified user
          this.router.navigate(['/']);
        },
        err => {
          console.log(err);
        }
      );
  }

}
