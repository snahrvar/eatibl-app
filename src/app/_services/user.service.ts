import { Injectable } from '@angular/core';
import * as decode from 'jwt-decode';

@Injectable()
export class UserService {

  constructor() {}

  //check if a user is logged in
  checkUser(){
    return localStorage.getItem('token');
  }

  //decode JWT payload object and send back for use
  getUserData(){
    if(localStorage.getItem('token'))
      return decode(localStorage.getItem('token'));
    else
      return null;
  }



}
