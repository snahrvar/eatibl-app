import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable'
import { map, tap } from 'rxjs/operators'
import { UserLog } from '../models/userLog.model'
import { environment }  from '../../environments/environment';

@Injectable()
export class AnalyticsUserLogService {

  constructor(private http: HttpClient) { }

  public getUserLog(deviceId):Observable<UserLog[]> {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem("eatiblToken")
    });
    return this.http.get<UserLog[]>(`${environment.apiURL}/analytics/userLogs/`+deviceId, { headers: headers })
      .pipe(
        map(userLogs => userLogs.map( t => {
          return { event: t.event, page: t.page, notes: t.notes, deviceId: t.deviceId, updatedAt: t.updated_at, createdAt: t.created_at }
        })),
        tap( console.log)
      );
  }

  public getRecentLog():Observable<UserLog[]> {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem("eatiblToken")
    });
    return this.http.get<UserLog[]>(`${environment.apiURL}/analytics/userLogs/recent`, { headers: headers })
      .pipe(
        map(userLogs => userLogs.map( t => {
          return { event: t.event, page: t.page, notes: t.notes, deviceId: t.deviceId, updatedAt: t.updated_at, createdAt: t.created_at }
        })),
        tap( console.log)
      );
  }


}
