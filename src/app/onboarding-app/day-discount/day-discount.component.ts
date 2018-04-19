import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
import { environment } from '../../../environments/environment';
import { FunctionsService } from './../../_services/functions.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-day-discount',
  templateUrl: 'day-discount.component.html',
  styleUrls: ['day-discount.component.scss']
})
export class DayDiscountComponent implements OnInit, OnDestroy {

  day: any;
  discounts: any;
  discountsCached: any;
  hours: any;
  restaurantId: any;
  private sub: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  submitted = false; //Used to disable submit button once pressed
  apiUrl = environment.apiURL;
  timeslotsSaved = false;
  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;

  constructor( private http: HttpClient, private route:ActivatedRoute, private router: Router, private functions: FunctionsService, public dialog: MatDialog ) {
    this.sub = this.route.params.subscribe(params => {
      this.day = params['day'];
      this.restaurantId = params['restaurantId'];
      this.http.get(this.apiUrl + '/discount/' + this.restaurantId + '/' + this.day)
        .subscribe(
          res => {
            this.discounts = res;
            this.http.get(this.apiUrl + '/hours/' + this.restaurantId)
              .subscribe(
                res => {
                  this.hours = res;
                  this.buildDiscountArray(this.discounts, this.hours);
                },
                err => {
                  console.log("Error occurred");
                }
              );
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

  //Configurations for all sliders. Second range config adds pips to last slider
  rangeConfig = {
      connect: [true, false],
      range: {
        min: 0,
        max: 50
      },
      step: 10,
      direction: 'rtl',
      orientation: 'vertical',
      tooltips: true,
      format: {
        to: function (value) {
          return value + '%';
        },
        from: function (value) {
          return value.replace('%', '');
        }
      }
    }; //End of rangeconfig

  //Used to display the raw time data as a clocktime on the frontend
  formatTime(value){
    var hour = Math.floor(value);
    if(hour < 13)
      return hour + ' AM';
    else if(hour >= 13 && hour < 24){
      hour = hour - 12;
      return hour + ' PM';
    }
    else if(hour >= 24){
      hour = hour - 24;
      return hour + ' AM';
    }
  }

  //To build the daily discount bars cards on front end
  buildDiscountArray(discounts, businessHours){
    var today = this.day;
    businessHours = _.filter(businessHours, function(dailyHours){
      return dailyHours['day'] == today;
    })

    //Loop through business hours for this day
    console.log(businessHours)
    for (var i = businessHours[0].open; i < businessHours[0].close; i = i + 0.5){
      var exists = _.findIndex(discounts, function(discount){
        return discount['time'] == i;
      });
      if(exists == -1) //Add zero entries to fill all business hours
        discounts.push({
          restaurant_fid: '5a4e84f70951642744164a7e',
          day: this.day,
          time: i,
          discount: 0,
          quantity: 0
        })
    }

    this.discounts = _.sortBy(discounts, function(discount){
      return discount['time'];
    })
    this.discountsCached = JSON.parse(JSON.stringify(this.discounts));
    this.timeslotsSaved = true;
    this.contentLoaded = true;
  }

  //Fired when change quatity buttons are pressed
  changeQuantity(time, amount){
    var discountEntry = _.find(this.discounts, function(discount){
        return discount['time'] == time;
      });
    discountEntry['quantity'] += amount;
    if(discountEntry['quantity'] < 0)
      discountEntry['quantity'] = 0;
    this.onChanges();
  }

  submitDiscounts(){
    this.submitted = true;
    this.http.post(this.apiUrl + '/discount/' + this.restaurantId + '/update', this.discounts)
      .subscribe(
        res => {
          this.timeslotsSaved = true;
          this.submitted = false; //After completion enable submit button
        },
        err => {
          console.log("Error occurred");
          this.submitted = false; //After completion enable submit button
        }
      );
  }

  //Navigate to main restaurant list
  prevPage(){
    if(!this.timeslotsSaved){
      this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          title: "Unsaved Data",
          message: "You have unsaved changes to this restaurant. Are you sure you would like to continue?"
        }
      });
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if(result)
          this.router.navigateByUrl('/' + this.restaurantId + '/pricing/week');
      })
    }
    else
      this.router.navigateByUrl('/' + this.restaurantId + '/pricing/week');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onChanges(){
    var isEqual = this.functions.compareObjects(this.discountsCached, this.discounts);
    if(isEqual)
      this.timeslotsSaved = true;
    else
      this.timeslotsSaved = false;
  }

}
