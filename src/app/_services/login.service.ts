import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

  constructor() {}

  //check if a user is logged in
  checkUser(){
    return localStorage.getItem('user');
  }

}
