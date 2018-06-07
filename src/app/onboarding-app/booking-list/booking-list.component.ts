import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as _ from 'underscore';
import { environment } from '../../../environments/environment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import { FunctionsService } from './../../_services/functions.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  bookings: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  apiUrl = environment.apiURL;

  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;

  constructor(private http: HttpClient, public dialog: MatDialog, public functions: FunctionsService, public router: Router) {
  }

  navigateTo(link, name){
    this.functions.changeRestaurantName(name);
    this.router.navigate([link])
  }

  unsetRestaurantName(){
    this.functions.changeRestaurantName('');
  }

  //Build the metadata for the frontend to use
  createBookingData(callback) {
    var bookings = this.bookings;

    //Collect date info for setting statuses and filtering bookings
    var dateNow = new Date(Date.now());

    //Set statuses of bookings
    for (var i = 0; i < bookings.length; i++) {
      //Set date of booking to full javascript date format
      var dateBookingRaw = new Date(bookings[i]['date']),
        hour = Math.floor(bookings[i]['time']),
        minute = (bookings[i]['time'] - hour) * 60,
        year = dateBookingRaw.getFullYear(),
        month = dateBookingRaw.getMonth(),
        day = dateBookingRaw.getDate(),
        dateBooking = new Date(year, month, day, hour, minute);

      //Don't set statuses if status is already cancelled
      if (!bookings[i]['status'])
        bookings[i]['status'] = dateBooking.getTime() > dateNow.getTime() ? 'Upcoming' : 'Completed';

      //Added new tag to booking if created within last 15 minutes
      var createdDate = +new Date(bookings[i]['created_at']);
      var fifteenMin = 15000 * 60;
      if ((+new Date() - createdDate) <= fifteenMin) {
        bookings[i]['statusNotify'] = 'new';
      }
    }

    //Set bookings to modified bookings list
    this.bookings = bookings;

    //Pass in context for this
    var self = this;
    callback(self);
  }

  ngOnInit() : void {
    this.unsetRestaurantName();
    this.http.get(this.apiUrl + '/booking/all')
      .subscribe(
        res => {
          this.bookings = res;
          console.log(this.bookings)
          this.createBookingData(function(self){
            self.contentLoaded = true;
          });
        },
        err => {
          console.log(err);
        }
      );
  }
}
