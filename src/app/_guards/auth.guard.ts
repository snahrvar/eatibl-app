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

    if(localStorage.getItem('eatiblToken')) {
      if (decode(localStorage.getItem('eatiblToken')).hasOwnProperty('restaurant_fid')){
        localStorage.removeItem('eatiblToken');
        this.router.navigate(['/login']);
        return false;
      }

      else
        return true
    }

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

    if(decode(localStorage.getItem('eatiblToken')).type == "Admin") {
      if (decode(localStorage.getItem('eatiblToken')).hasOwnProperty('restaurant_fid')) {
        localStorage.removeItem('eatiblToken');
        this.router.navigate(['/login']);
        return false;
      }
      else
        return true
    }

    else {
      this.router.navigate(['/login']);
    }
    return false;
  }
}
