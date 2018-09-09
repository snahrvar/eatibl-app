import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable'
import { map, tap } from 'rxjs/operators'
import { User } from '../models/user.model'

@Injectable()
export class AnalyticsUserService {
  
  private url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public getUsers():Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/api/restaurant/allusers`)
      .pipe(
        map(users => users.map( t => { 
          return { name: t.name, phone: t.phone, email: t.email, type: t.type, updatedAt: t.updatedAt } 
        })),
        tap( console.log)
      );
  }

}