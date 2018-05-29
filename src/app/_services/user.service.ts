import { Injectable } from '@angular/core';
import * as decode from 'jwt-decode';

@Injectable()
export class UserService {

  constructor() {}

  //check if a user is logged in
  checkUser(){
    return localStorage.getItem('eatiblToken');
  }

  logout(){
    if(localStorage.getItem('eatiblToken')) {
      localStorage.removeItem('eatiblToken'); //log out
    }
  }

  //decode JWT payload object and send back for use
  getUserData(){
    if(localStorage.getItem('eatiblToken'))
      return decode(localStorage.getItem('eatiblToken'));
    else
      return null;
  }



}
