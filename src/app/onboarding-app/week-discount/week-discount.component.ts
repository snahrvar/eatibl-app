import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import { environment } from '../../../environments/environment';
import {Location} from '@angular/common';
import { FunctionsService } from '../../_services/functions.service';
import { UIChart } from "primeng/components/chart/chart";
import * as decode from 'jwt-decode';
import * as _ from 'underscore';

@Component({
  selector: 'app-week-discount',
  templateUrl: 'week-discount.component.html',
  styleUrls: ['week-discount.component.scss']
})
export class WeekDiscountComponent implements OnInit {
  @ViewChild('chart') chart: UIChart;
  private sub: any;
  restaurantId: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;

  discounts: any;
  businessHours: any;
  loading = []; //Used to overlay loading screen on day that is being updated
  graph = [];
  discountArray = [];
  apiUrl = environment.apiURL;
  userData: any;
  result: any;
  response: any; //for use in updateData http call

  //To build the daily discount bars cards on front end
  buildDiscountArray(discounts, businessHours){
    var discountArray = [];

    //Loop through each day
    for (var i = 0; i < businessHours.length; i++){
      let day = {} as any;
      day.day = businessHours[i].day; //For card header
      var hoursLength = businessHours[i].hours.length;

      //Build the y-axes values for the discount chart
      day.discountValue = new Array ((businessHours[i].hours[hoursLength - 1] - businessHours[i].hours[0]) * 2); //Initialize array based on business hours
      day.discountValue.fill(0);

      for (var a = 0; a < discounts.length; a++){
        if(discounts[a].day == day.day){
          var index = (discounts[a].time - businessHours[i].hours[0]) * 2;
          day.discountValue[index] = discounts[a].discount;
        }
      }

      //Build the x-axes labels for the discount chart
      day.discountTime = [];

      for (var x = 0; x < day.discountValue.length; x++){
        day.discountTime.push(businessHours[i].hours[0] +(0.5 * x));
      }

      //If
      if(businessHours[i].hours[0] != businessHours[i].hours[hoursLength - 1]){
        discountArray.push(day);
        this.loading.push(false);
      }
    }
    this.contentLoaded = true;
    return discountArray;
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

  //Update chart data
  updateData(index, discount){
    this.http.get(this.apiUrl + '/discount/' + this.restaurantId + '/' + this.discountArray[index].day)
      .subscribe(
        res => {
          this.response = res; //Cache response to avoid typescript errors

          //Rebuild discounts array and chart data for particular day
          this.discountArray[index] = this.buildDiscountArray(this.response, this.businessHours)[index];
          this.graph[index].data.datasets[0].data = this.discountArray[index].discountValue;
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  constructor(private http: HttpClient, private route:ActivatedRoute, private router: Router, private _location: Location, public functions: FunctionsService, public dialog: MatDialog) {

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];

      //Since the service is not able to recall the value from the booking module, we'll HACK IT.
      if(!this.functions.link) //no value means we're coming from restaurant app
        this.functions.link = 'restaurant/'+this.restaurantId + '/bookings';  //restaurant back link
    })
  }

  //Navigate to business hours
  editTimeslots(day){
      this.router.navigateByUrl('/' + this.restaurantId + '/pricing/' + day);
  }

  //Navigate to business hours
  prevPage(){
    if(this.userData.type != 'Restaurant') //for admin
      this.router.navigateByUrl('/' + this.restaurantId + '/hours');
    else //for restaurants
      this.router.navigate(['/restaurant/' + this.restaurantId + '/settings']);
  }

  //Copy the discounts of the previous day
  copyDiscounts(index){
    var currentDay = this.discountArray[index].day;
    var previousDay = this.discountArray[index-1].day;
    this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: "Copy Discounts",
        message: "Would you like to copy the discount curve from "+this.discountArray[index - 1].day+"?"
      }
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
      this.loading[index] = true;
      if(result)
        this.http.post(this.apiUrl + '/discount/' + this.restaurantId + '/copy', {'previousDay': previousDay, 'currentDay': currentDay})
          .subscribe(
            res => {
              this.updateData(index, res);
              this.loading[index] = false;
            },
            err => {
              console.log(err);
              this.loading[index] = false;
            }
          );
      else
        this.loading[index] = false;
    })
  }

  getData(){
    this.http.get(this.apiUrl + '/discount/' + this.restaurantId + '/week')
      .subscribe(
        res => {
          this.discounts = res;
          this.http.get(this.apiUrl + '/hours/' + this.restaurantId)
            .subscribe(
              res => {
                this.result = res; //cache res so it doesn't mess up the sortby
                var dayArray = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]; //For sorting the business hours object
                this.businessHours = _.sortBy(this.result, function(day){
                  return dayArray.indexOf(day['day'])
                });
                this.discountArray = this.buildDiscountArray(this.discounts, this.businessHours);
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
  }

  ngOnInit() {
    this.userData = decode(localStorage.getItem('eatiblToken'));
    this.getData();
  }

}
