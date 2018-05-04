import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from '../../../node_modules/rxjs/Observable.d';
import * as decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(localStorage.getItem('token'))
      return true;

    else {
      this.router.navigate(['/login']);
    }
    return false;
  }
}

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      console.log(decode(localStorage.getItem('token')).type)

    if(decode(localStorage.getItem('token')).type == "Admin")
      return true;

    else {
      this.router.navigate(['/login']);
    }
    return false;
  }
}
