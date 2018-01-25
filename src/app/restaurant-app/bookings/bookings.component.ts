import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-bookings',
  templateUrl: 'bookings.component.html',
  styleUrls: ['bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  private sub: any;
  restaurantId: any;
  restaurant: any;
  allBookings: any;
  dayBookings: any;
  filteredBookings: any;
  filters = [];
  date: any;
  total = {
    bookings: 0,
    people: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0
  }
  contentLoaded = false; //Prevent content from loading until api calls are returned
  refreshing = false; //Prevent users from making multiple refresh requests until one has completed
  apiUrl = environment.apiURL;

  //For testing purposes
  details = {
    name: '',
    phone: '',
    time: '',
    discount: '',
    party: '',
  };

  constructor(private http: HttpClient, private renderer: Renderer2, private route:ActivatedRoute, private router: Router) {
  }

  //Build the date object for the front end
  buildDate(date){
    //Ensure date is in javascript date format
    date = new Date(date);

    //Get todays date
    var today = new Date(Date.now());

    //Get numeric values
    var day = date.getDay();
    var month = date.getMonth();
    var dateNumber = date.getDate();

    //Combine with numeric values as array indexes to get string format of day/month
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    this.date = {
      raw: date,
      day: (today.getDate() == dateNumber && today.getMonth() == month) ? 'Today' : days[day],
      month: months[month],
      date: dateNumber
    }
  }

  //Sum all of one property in a series of objects
  sum(array, property){
    var total = 0;
    for ( var i = 0; i < array.length; i++ ) {
      total += array[i][property]
    }
    return total
  }

  //Build the metadata for the frontend to use
  createBookingData(restaurant, callback){
    var bookings = _.sortBy(restaurant.bookings, 'time');

    //Collect date info for setting statuses and filtering bookings
    var todayDate = new Date(Date.now()),
      timeNow: any = +todayDate.getHours() + (+todayDate.getMinutes() / 60),
      dateNow = todayDate.getDate();

    //Set statuses of bookings
    for(var i = 0; i < bookings.length; i++){
      var timeBooking = bookings[i]['time'];

      //Don't set statuses if status is already cancelled
      if(!bookings[i]['status'])
        bookings[i]['status'] = timeBooking > timeNow ? 'Upcoming' : 'Completed';
    }

    //Set allBookings before bookings list has been filtered
    this.allBookings = this.dayBookings = this.filteredBookings = bookings;

    //Filter bookings by date
    this.dayBookings = this.filteredBookings = _.filter(this.allBookings, function(booking){
      var dateBooking = new Date(booking['date']),
          dayBooking = dateBooking.getDate();
      return dayBooking == dateNow;
    });

    //Set booking totals for a specific day
    this.setTotals();

    //Pass in context for this
    var self = this;
    callback(self);
  }

  //Filter the booking data
  filterBookings(event, filter){
    var filters = this.filters; //Stage filters so we can ignore 'this' conflicts

    if(this.filters.indexOf(filter) > -1){
      this.renderer.removeClass(event.target,"active");
      this.filters.splice(this.filters.indexOf(filter), 1);
    }
    else {
      this.renderer.addClass(event.target,"active");
      this.filters.push(filter);
    }

    if(filters.length)
      this.filteredBookings = _.filter(this.dayBookings, function(booking){
        var results = false;
        for(var i = 0; i < filters.length; i++){
          if(filters[i] == booking['status'])
            results = true;
        }
        return results;
      });
    else
      this.filteredBookings = this.dayBookings;
  }

  //Set the bookings aggregate data
  setTotals(){
    this.total.bookings = this.filteredBookings.length;
    this.total.people = this.sum(this.filteredBookings, 'party');
    this.total['upcoming'] = _.filter(this.filteredBookings, function(booking){return booking['status'] == 'Upcoming';}).length;
    this.total['completed'] = _.filter(this.filteredBookings, function(booking){return booking['status'] == 'Completed';}).length;
    this.total['cancelled'] = _.filter(this.filteredBookings, function(booking){return booking['status'] == 'Cancelled';}).length;
    this.total['noShow'] = _.filter(this.filteredBookings, function(booking){return booking['status'] == 'No Show';}).length;
  }

  //Refresh the current list of bookings with a new get request
  refreshBookings(){
    this.refreshing = true;

    this.http.get(this.apiUrl + '/restaurant/' + this.restaurantId)
      .subscribe(
        res => {
          this.restaurant = res;
          this.createBookingData(this.restaurant, function(self){
            self.refreshing = false;
          });
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  //FOR TESTING ONLY
  submitBooking() {
    var booking = {
      restaurantId: this.restaurantId,
      details: this.details
    }

    this.http.post(this.apiUrl + '/booking/create', booking)
      .subscribe(
        res => { //Returns restaurant ID
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }
  //FOR TESTING ONLY

  ngOnInit() {
    this.buildDate(Date.now());

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
      console.log(this.restaurantId);
      //Only get restaurant information if we are editing an existing one
      this.http.get(this.apiUrl + '/restaurant/' + this.restaurantId)
        .subscribe(
          res => {
            this.restaurant = res;
            this.createBookingData(this.restaurant, function(self){
              self.contentLoaded = true;
            });
            console.log(this.restaurant);
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

}
