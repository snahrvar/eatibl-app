import { Component,OnInit  } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['business-hours.component.scss']
})
export class BusinessHoursComponent implements OnInit {
  private sub: any;
  restaurantId: any;
  result: any; //Store http get result to be able to use .length
  contentLoaded = false; //Prevent content from loading until api calls are returned
  submitted = false; //Used to disable submit button once pressed
  apiUrl = environment.apiURL;

  //Default business hours
  businessHoursArray = [];
  businessHours = [
    {day: "Monday", open: 9, close: 21},
    {day: "Tuesday", open: 9, close: 21},
    {day: "Wednesday", open: 9, close: 21},
    {day: "Thursday", open: 9, close: 21},
    {day: "Friday", open: 9, close: 21},
    {day: "Saturday", open: 9, close: 21},
    {day: "Sunday", open: 9, close: 21}
  ];
  newHours = [];

  rangeConfig: any = {
    connect: true,
    range: {
      min: 6,
      max: 30
    },
    step: 0.5,
    tooltips: [{
      to: function (value) {
        var clockTime;
        var hour = Math.floor(value);
        var minutes = (value - hour) == 0.5 ? ':30' : ':00';
        if(hour < 12)
          clockTime = hour + minutes + ' AM';
        else if(hour < 13 && hour >= 12)
          clockTime = hour + minutes + ' PM';
        else if(hour >= 13 && hour < 24){
          hour = hour - 12;
          clockTime = hour + minutes + ' PM';
        }
        else if(hour >= 24){
          hour = hour - 24;
          clockTime = hour + minutes + ' AM';
        }
        return clockTime;
      }
    },
      {
        to: function (value) {
          var clockTime;
          var hour = Math.floor(value);
          var minutes = (value - hour) == 0.5 ? ':30' : ':00';
          if(hour < 12)
            clockTime = hour + minutes + ' AM';
          else if(hour < 13 && hour >= 12)
            clockTime = hour + minutes + ' PM';
          else if(hour >= 13 && hour < 24){
            hour = hour - 12;
            clockTime = hour + minutes + ' PM';
          }
          else if(hour >= 24){
            hour = hour - 24;
            clockTime = hour + minutes + ' AM';
          }
          return clockTime;
        }
      }],
    pips: { // Show a scale with the slider
      mode: 'values',
      values: [],
      density: 100/24,
      stepped: true
    }
  };

  constructor(private http: HttpClient, private route:ActivatedRoute, private router: Router  ){

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
      //Only get restaurant information if we are editing an existing one
      this.http.get(this.apiUrl + '/hours/' + this.restaurantId)
        .subscribe(
          res => {
            this.result = res; //res alone will not accept a .length check
            if (this.result.length)
              this.businessHours = this.result;
            this.buildBusinessHoursArray(this.businessHours);
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

  open24hrs(){
    this.businessHoursArray = [[6,30],[6,30],[6,30],[6,30],[6,30],[6,30],[6,30]];
  }

  closedToday(index){
    this.businessHoursArray[index] = [9,9];
  }

  buildBusinessHoursArray(businessHours){
    for (var i = 0; i < businessHours.length; i++){
      this.businessHoursArray.push([businessHours[i].open, businessHours[i].close]);
    }
    this.contentLoaded = true;
  }

  processHours(businessHoursArray){
    for( var i = 0; i < businessHoursArray.length; i++){
      var openHour = businessHoursArray[i][0],
          closeHour = businessHoursArray[i][1];
      this.newHours.push({
        day: this.businessHours[i]['day'],
        open: openHour,
        close: closeHour
      })
    }
  }

  submitHours(){
    this.submitted = true;
    this.processHours(this.businessHoursArray);
    this.http.post(this.apiUrl + '/hours/' + this.restaurantId + '/create', this.newHours)
      .subscribe(
        res => {
          console.log(res);
          this.router.navigateByUrl('/' + this.restaurantId + '/keyHours');
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  ngOnInit() {
  }

}
