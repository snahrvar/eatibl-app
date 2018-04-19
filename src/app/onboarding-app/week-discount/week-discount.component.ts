import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {Location} from '@angular/common';
import { FunctionsService } from '../../_services/functions.service';

@Component({
  selector: 'app-week-discount',
  templateUrl: 'week-discount.component.html',
  styleUrls: ['week-discount.component.scss']
})
export class WeekDiscountComponent implements OnInit {
  private sub: any;
  private router: any;
  restaurantId: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned

  discounts: any;
  businessHours: any;
  graph = [];
  discountArray = [];
  apiUrl = environment.apiURL;

  //To build the daily discount bars cards on front end
  buildDiscountArray(discounts, businessHours){

    //Loop through each day
    for (var i = 0; i < businessHours.length; i++){
      let day = {} as any;
      day.day = businessHours[i].day; //For card header

      //Build the y-axes values for the discount chart
      day.discountValue = new Array ((businessHours[i].close - businessHours[i].open) * 2); //Initialize array based on business hours
      day.discountValue.fill(0);

      for (var a = 0; a < discounts.length; a++){
        if(discounts[a].day == day.day){
          var index = (discounts[a].time - businessHours[i].open) * 2;
          day.discountValue[index] = discounts[a].discount;
        }
      }

      //Build the x-axes labels for the discount chart
      day.discountTime = [];

      for (var x = 0; x < day.discountValue.length; x++){
        day.discountTime.push(businessHours[i].open +(0.5 * x));
      }

      this.discountArray.push(day);
    }
    this.contentLoaded = true;
  }

  //Generate discount bar charts
  generateCharts(){
    for(var i = 0; i < this.discountArray.length; i++) {
      this.graph.push({
        'data': {
          labels: this.discountArray[i].discountTime,
          datasets: [
            {
              label: 'Discount',
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              data: this.discountArray[i].discountValue
            }
          ]
        },
        'options': {
          legend: {
            display: false
          },
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                stepSize: 10,
                max: 50,
                beginAtZero: true
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                callback: function(value, index, values) {
                  var hour = Math.floor(value);
                  var minutes = (value - hour) > 0 ? ':30' : ':00';
                  if(hour < 13)
                    return hour + minutes + ' AM';
                  else if(hour >= 13 && hour < 24){
                    hour = hour - 12;
                    return hour + minutes + ' PM';
                  }
                  else if(hour >= 24){
                    hour = hour - 24;
                    return hour + minutes + ' AM';
                  }
                }
              }
            }]
          }
        }
      })
    }
  }

  constructor(private http: HttpClient, private route:ActivatedRoute, private router: Router, private _location: Location, public functions: FunctionsService) {

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];

      //Since the service is not able to recall the value from the booking module, we'll HACK IT.
      if(!this.functions.link) //no value means we're coming from restaurant app
        this.functions.link = 'restaurant/'+this.restaurantId + '/bookings';  //restaurant back link

      this.http.get(this.apiUrl + '/discount/' + this.restaurantId + '/week')
        .subscribe(
          res => {
            this.discounts = res;
            this.http.get(this.apiUrl + '/hours/' + this.restaurantId)
              .subscribe(
                res => {
                  this.businessHours = res;
                  console.log(this.businessHours);
                  this.buildDiscountArray(this.discounts, this.businessHours);
                  console.log(this.discountArray);
                  this.generateCharts();
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
    })
  }

  //Navigate to business hours
  editTimeslots(day){
      this.router.navigateByUrl('/' + this.restaurantId + '/pricing/' + day);
  }

  //Navigate to business hours
  prevPage(){
      this.router.navigateByUrl('/' + this.restaurantId + '/hours');
  }

  //Navigate to main restaurant list
  goHome(){
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
  }

}
