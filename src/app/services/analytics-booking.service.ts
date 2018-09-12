import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable'
import { map, tap } from 'rxjs/operators'
import { Booking } from '../models/booking.model'
import { environment }  from '../../environments/environment';

@Injectable()
export class AnalyticsBookingService {

  constructor(private http: HttpClient) { }

  public getBookings():Observable<Booking[]> {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem("eatiblToken")
    });
    return this.http.get<Booking[]>(`${environment.apiURL}/analytics/bookings/all`, { headers: headers })
      .pipe(
        map(bookings => bookings.map( t => {
          return { restaurant_fid: t.restaurant_fid.name || {}, user_fid: t.user_fid ? t.user_fid.deviceId : "", date: String(t.date).substring(0,10), time: t.time, discount: t.discount, people: t.people,
            name: t.name, email: t.email, redeemed: t.redeemed || {}, disabled: t.disabled, createdAt: t.created_at }
        })),
        tap( console.log)
      );
  }

}
