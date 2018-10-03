import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable'
import { map, tap } from 'rxjs/operators'
import { Restaurant } from '../models/restaurant.model'
import { environment }  from '../../environments/environment';

@Injectable()
export class AnalyticsRestaurantService {

  constructor(private http: HttpClient) { }

  public getRestaurants():Observable<Restaurant[]> {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem("eatiblToken")
    });
    return this.http.get<Restaurant[]>(`${environment.apiURL}/analytics/restos/activity`, { headers: headers })
      .pipe(
        map(users => users.map( t => {
          return { name: t.name, vicinity: t.vicinity, bookings: t.bookings, bookingCount: t.bookings.length, bookingAttempt: t.bookingAttempt, customers: t.customers, mapVisit: t.mapVisit,
            cardVisit: t.cardVisit, markerClick: t.markerClick, updatedAt: t.updatedAt, created_at: t.created_at, _id: t._id }
        })),
        tap( console.log)
      );
  }

}
