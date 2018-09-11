import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable'
import { map, tap } from 'rxjs/operators'
import { User } from '../models/user.model'
import { environment }  from '../../environments/environment';

@Injectable()
export class AnalyticsUserService {

  constructor(private http: HttpClient) { }

  public getUsers():Observable<User[]> {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem("eatiblToken")
    });
    return this.http.get<User[]>(`${environment.apiURL}/analytics/users/all`, { headers: headers })
      .pipe(
        map(users => users.map( t => {
          return { name: t.name, phone: t.phone, email: t.email, type: t.type, deviceId: t.deviceId, updatedAt: t.updated_at, createdAt: t.created_at }
        })),
        tap( console.log)
      );
  }

}
