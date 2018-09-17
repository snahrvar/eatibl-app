import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable'
import { map, tap } from 'rxjs/operators'
import { Device } from '../models/device.model'
import { environment }  from '../../environments/environment';

@Injectable()
export class AnalyticsDeviceService {

  constructor(private http: HttpClient) { }

  public getDevices():Observable<Device[]> {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem("eatiblToken")
    });
    return this.http.get<Device[]>(`${environment.apiURL}/analytics/devices/all`, { headers: headers })
      .pipe(
        map(users => users.map( t => {
          return { deviceId: t.deviceId, platform: t.platform, model: t.model, version: t.version, eatiblVersion: t.eatiblVersion, updatedAt: t.updated_at, createdAt: t.created_at }
        })),
        tap( console.log)
      );
  }

}
