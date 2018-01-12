import { Component,OnInit  } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


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

  constructor(private http: HttpClient, private route:ActivatedRoute, private router: Router  ){

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
      //Only get restaurant information if we are editing an existing one
      this.http.get('http://localhost:3000/hours/' + this.restaurantId)
        .subscribe(
          res => {
            this.result = res; //res alone will not accept a .length check
            if (this.result.length)
              this.businessHours = this.result;
            this.buildBusinessHoursArray(this.businessHours);
            console.log(this.businessHours);
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

  buildBusinessHoursArray(businessHours){
    for (var i = 0; i < businessHours.length; i++){
      this.businessHoursArray.push([businessHours[i].open, businessHours[i].close]);
    }
    this.contentLoaded = true;
  }

  rangeConfig: any = {
    connect: true,
    range: {
      min: 0,
      max: 24
    },
    step: 0.5,
    behaviour: 'drag',
    tooltips: [true, true],
    pips: { // Show a scale with the slider
      mode: 'values',
      values: [],
      density: 100/24,
      stepped: true
    }
  }

  submitHours(){
    this.submitted = true;
    this.http.post('http://localhost:3000/hours/' + this.restaurantId + '/create', this.businessHours)
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
