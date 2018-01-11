import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-day-discount',
  templateUrl: './day-discount.component.html',
  styleUrls: ['./day-discount.component.scss']
})
export class DayDiscountComponent implements OnInit, OnDestroy {

  constructor( private http: HttpClient, private route:ActivatedRoute ) {
    this.sub = this.route.params.subscribe(params => {
      this.day = params['day'];
      this.http.get('http://localhost:3000/discount/' + this.day)
        .subscribe(
          res => {
            this.discounts = res;
            this.http.get('http://localhost:3000/hours')
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

  day: any;
  discounts: any;
  hours: any;
  private sub: any;
  contentLoaded = false; //Changes to true once api calls are returned

  //Configurations for all sliders. Second range config adds pips to last slider
  rangeConfig= [{
      connect: [true, false],
      range: {
        min: 0,
        max: 50
      },
      step: 10,
      direction: 'rtl',
      orientation: 'vertical'
    },
      {
      connect: [true, false],
      range: {
        min: 0,
        max: 50
      },
      step: 10,
      direction: 'rtl',
      orientation: 'vertical',
      pips: { // Show a scale with the slider
        mode: 'steps',
        stepped: true,
        density: 20
      }
    }
  ]; //End of rangeconfig

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
    this.contentLoaded = true;
    console.log(this.discounts);
  }

  //Fired when change quatity buttons are pressed
  changeQuantity(time, amount){
    var discountEntry = _.find(this.discounts, function(discount){
        return discount['time'] == time;
      });
    discountEntry['quantity'] += amount;
    if(discountEntry['quantity'] < 0)
      discountEntry['quantity'] = 0;
  }

  submitDiscounts(){
    this.http.post('http://localhost:3000/discount/update', this.discounts)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
