import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

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
  newUser = {
    full_name: '',
    newEmail: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor() {
    this.contentLoaded = true;
  }

  ngOnInit() {
  }

  submitLogin(){

  }

  submitRegister(){

  }

}
