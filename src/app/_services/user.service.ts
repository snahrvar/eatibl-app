import { Injectable } from '@angular/core';
import * as decode from 'jwt-decode';

@Injectable()
export class UserService {

  constructor() {}

  //check if a user is logged in
  checkUser(){
    return localStorage.getItem('token');
  }

  logout(){
    if(localStorage.getItem('token')) {
      localStorage.removeItem('token'); //log out
    }
  }

  //decode JWT payload object and send back for use
  getUserData(){
    console.log('called');
    if(localStorage.getItem('token'))
      return decode(localStorage.getItem('token'));
    else
      return null;
  }



}
