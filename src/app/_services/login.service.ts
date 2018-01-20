import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

  constructor() {}

  activeUser:any;

  //record successful login
  userLogin(user){
    this.activeUser = user;
  }

  //record logout (remove user)
  userLogout(){
    this.activeUser = null;
  }

  //check if a user is logged in
  checkUser(){
    return this.activeUser != null;
  }

}
