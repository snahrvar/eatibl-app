import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import { FunctionsService } from '../../_services/functions.service';
import {ClockService} from "../../_services/clock.service";
import {Observable} from 'rxjs/Rx';


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
  filters = ['Upcoming'];
  date: any;
  clock: any;
  datePicked: any;
  total = {
    bookings: 0,
    people: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0
  }
  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  refreshing = false; //Prevent users from making multiple refresh requests until one has completed
  apiUrl = environment.apiURL;
  subTime = Observable.interval(10000 * 60).subscribe(x => { //Refresh booking table every 10 minutes
    this.refreshBookings();
  });

  //For testing purposes
  details = {
    name: '',
    phone: '',
    time: '',
    discount: '',
    people: '',
  };

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private route:ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private functions: FunctionsService,
    private clockService: ClockService
  ) {}

  //Report no show
  reportNoShow(booking){
    //console.log(booking._id);
    this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: "Report No Show",
        message: "Would you like to report " + booking.name + " as a no show?"
      }
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
      console.log(booking._id);
      if(result)
        this.http.get(this.apiUrl + '/booking/' + booking._id + '/update/noshow',)
          .subscribe(
            res => {
              this.refreshBookings();
            },
            err => {
              console.log(err);
            }
          );
    })
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

  //Change day by one day in either diredction
  changeDay(direction){
    var date = new Date(this.datePicked);

    if(direction == 'prev')
      date.setDate(date.getDate() - 1);
    else if(direction == 'next')
      date.setDate(date.getDate() + 1);

    this.datePicked = date;
  }

  //Refresh table every 10 minutes


  //Set the current day to the selected day
  setDay(){
    this.buildDate(this.datePicked);
    this.refreshBookings();
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
  createBookingData(callback){
    var bookings = _.sortBy(this.allBookings, 'time');

    //Collect date info for setting statuses and filtering bookings
    var todayDate = new Date(this.date['raw']),
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

    //Filter bookings by filter set
    this.filterBookings();

    //Set booking totals for a specific day
    this.setTotals();

    //Pass in context for this
    var self = this;
    callback(self);
  }

  //Filter the booking data
  filterBookings(){
    var filters = this.filters; //Stage filters so we can ignore 'this' conflicts

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

  //Add/remove filters
  toggleFilter(event, filter){
    if(this.filters.indexOf(filter) > -1)
      this.filters.splice(this.filters.indexOf(filter), 1);
    else
      this.filters.push(filter);

    this.filterBookings();
  }

  //Set the bookings aggregate data
  setTotals(){
    this.total.bookings = this.dayBookings.length;
    this.total.people = this.sum(this.dayBookings, 'people');
    this.total['upcoming'] = _.filter(this.dayBookings, function(booking){return booking['status'] == 'Upcoming';}).length;
    this.total['completed'] = _.filter(this.dayBookings, function(booking){return booking['status'] == 'Completed';}).length;
    this.total['cancelled'] = _.filter(this.dayBookings, function(booking){return booking['status'] == 'Cancelled';}).length;
    this.total['noShow'] = _.filter(this.dayBookings, function(booking){return booking['status'] == 'No Show';}).length;
  }

  //Refresh the current list of bookings with a new get request
  refreshBookings(){
    this.refreshing = true;

    this.http.get(this.apiUrl + '/booking/' + this.restaurantId)
      .subscribe(
        res => {
          this.allBookings = res;
          this.createBookingData(function(self){
            self.refreshing = false;
          });
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  //FOR TESTING ONLY
  generateBooking() {
    this.http.get(this.apiUrl + '/booking/'+this.restaurantId+'/generate')
      .subscribe(
        res => { //Returns restaurant ID
          console.log(res);
          this.refreshBookings(); //refresh bookings
        },
        err => {
          console.log(err);
        }
      );
  }
  //FOR TESTING ONLY

  ngOnInit() {
    this.buildDate(Date.now());
    this.datePicked = new Date(Date.now());
    this.clockService.getClock().subscribe(time => this.clock = time);

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];

      //set navigation url for weekly pricing page (so we can set link for back button)
      this.functions.setNavigation('restaurant/'+this.restaurantId + '/bookings');

      console.log(this.restaurantId);
      //Only get restaurant information if we are editing an existing one
      this.http.get(this.apiUrl + '/restaurant/' + this.restaurantId)
        .subscribe(
          res => {
            this.restaurant = res;

            //make API call for bookings
            this.http.get(this.apiUrl + '/booking/' + this.restaurantId)
              .subscribe(
                res => {
                  //save all bookings for this restaurant
                  this.allBookings = res;
                  this.createBookingData(function(self){
                    self.contentLoaded = true;
                  });
                },
                err => {console.log(err)}
              );
          },
          err => {console.log(err)}
        );
    });
  }

  ngOnDestroy(){
    this.subTime.unsubscribe();
  }

}
