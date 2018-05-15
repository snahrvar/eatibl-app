import { Component,OnInit,ViewChildren,ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { FunctionsService } from './../../_services/functions.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import * as decode from 'jwt-decode';
import * as _ from 'underscore';


@Component({
  selector: 'app-business-hours',
  templateUrl: 'business-hours.component.html',
  styleUrls: ['business-hours.component.scss']
})
export class BusinessHoursComponent implements OnInit {
  @ViewChildren('slider') sliders;

  private sub: any;
  restaurantId: any;
  result: any; //Store http get result to be able to use .length
  contentLoaded = false; //Prevent content from loading until api calls are returned
  submitted = false; //Used to disable submit button once pressed
  apiUrl = environment.apiURL;
  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;

  //Default business hours
  businessHoursArray = [];
  businessHoursArrayCached = [];
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
  hoursSaved = false; //Used to toggle disabled on the save button
  hasHours = false; //Set to true if editing a businesses hours or if a new restaurants hours have been saved. Disables next button if false
  userData: any;

  //Initialiize options for sliders
  sliderOn = [true,true,true,true,true,true,true]; //Used hiding and showing the sliders so they are recreated after being destroyed
  isSplit = [false,false,false,false,false,false,false]; //store whether any slider is split or not
  formatTooltip = function (value) { //Store tooltip function to clean up code
    value = Math.round( value * 10) / 10; //Strip out erroneous extra decimals that nouislider sometimes adds
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
  };
  rangeConfig = [];
  sliderOptions: any = {
    connect: true,
    range: {
      min: 6,
      max: 30
    },
    step: 0.5,
    tooltips: [{to: this.formatTooltip}, {to: this.formatTooltip}],
    pips: { // Show a scale with the slider
      mode: 'values',
      values: [],
      density: 100/24,
      stepped: true
    }
  };

  constructor(private http: HttpClient, private route:ActivatedRoute, private router: Router, private functions: FunctionsService, public dialog: MatDialog, public cdRef: ChangeDetectorRef){

    //Initialize config options for noUiSliders
    for (var i= 0; i < 7; i++){
      this.rangeConfig.push(this.sliderOptions);
    }

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
      //Only get restaurant information if we are editing an existing one
      this.http.get(this.apiUrl + '/hours/' + this.restaurantId)
        .subscribe(
          res => {
            this.result = res; //res alone will not accept a .length check
            if (this.result.length){
              var dayArray = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]; //For sorting the business hours object
              this.hoursSaved = true;
              this.hasHours = true;
              this.businessHours = _.sortBy(this.result, function(day){
                return dayArray.indexOf(day.day)
              });
            }
            this.buildBusinessHoursArray(this.businessHours);
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

  //Copy hours from previous day to selected day
  copyHours(index){
    ///Cache from and to business hour arrays
    var fromArray = this.businessHoursArray[index - 1];
    var toArray = this.businessHoursArray[index];

    //If either from array or to array are split, use splitSlider function. Otherwise just copy
    if((fromArray.length == 4 && toArray.length == 2) || (fromArray.length == 2 && toArray.length == 4))
      this.splitSlider(index, 'copy');
    else
      this.businessHoursArray[index] = this.businessHoursArray[index - 1];
    this.onChanges();
  }

  //Split hours into two segments to show that a restaurant is close for a portion of the day
  splitSlider(index, type){
    var newHours = [];
    var hoursCached = this.businessHoursArray[index];

    //Destroy slider to allow new config options
    this.sliders._results[index].slider.destroy();
    this.sliderOn[index] = false; //Remove slider from dom

    //Build new businessHoursArray at index (day)
    if(type == 'copy'){ //If we are copying, add previous day values to new hours
      newHours = this.businessHoursArray[index - 1];
    }
    else { //If we are just splitting, cache the hours of current day
      var hoursCached = this.businessHoursArray[index];
      var splitStart = Math.floor((hoursCached[0] + hoursCached[1]) / 2); //Split the hours in the middle
      var splitEnd = splitStart + 1; //Start of second segment one hour after end of first

      if(hoursCached.length == 2) //If current day is not split, split into newHours
        newHours = [hoursCached[0], splitStart, splitEnd, hoursCached[1]];
      else //If current day is split, combine into newHours
        newHours = [hoursCached[0], hoursCached[3]];
    }

    //If today is not split
    if(hoursCached.length == 2){
      this.rangeConfig[index].connect = [false, true, false, true, false];
      this.rangeConfig[index].tooltips = [{to: this.formatTooltip},{to: this.formatTooltip},{to: this.formatTooltip},{to: this.formatTooltip}];
      this.businessHoursArray[index] = [newHours[0], newHours[1], newHours[2], newHours[3]];

      //Detect changes to scope and re-add slider to dom so that it recreates itself
      this.cdRef.detectChanges();
      this.sliderOn[index] = true;
      this.isSplit[index] = true;
    }
    else{
      this.rangeConfig[index].connect = true;
      this.rangeConfig[index].tooltips = [{to: this.formatTooltip},{to: this.formatTooltip}];
      this.businessHoursArray[index] = [newHours[0], newHours[1]];

      //Detect changes to scope and re-add slider to dom so that it recreates itself
      this.cdRef.detectChanges();
      this.sliderOn[index] = true;
      this.isSplit[index] = false;
    }
    this.onChanges();
  }

  open24hrs(){
    this.businessHoursArray = [[6,30],[6,30],[6,30],[6,30],[6,30],[6,30],[6,30]];
    this.onChanges();
  }

  //Toggle whether restaurant is open or closed that day
  closedToday(index){
    this.businessHoursArray[index] = [9,9]; //Set both ends of the slider to the same time
    this.onChanges();
  }

  buildBusinessHoursArray(businessHours){
    for (var i = 0; i < businessHours.length; i++){
      this.businessHoursArray.push([businessHours[i].open, businessHours[i].close]);
    }
    this.businessHoursArrayCached = JSON.parse(JSON.stringify(this.businessHoursArray));
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
          this.hasHours = true;
          this.hoursSaved = true;
          this.submitted = false;
          console.log("Hours saved");
        },
        err => {
          console.log("Error occurred");
          this.submitted = false;
        }
      );
  }

  //Navigate to main restaurant list
  prevPage(){
    if(this.userData.type != 'Restaurant'){ //for admin
      if(!this.hoursSaved){
        this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
          data: {
            title: "Unsaved Data",
            message: "You have unsaved changes to this restaurant. Are you sure you would like to continue?"
          }
        });
        this.confirmDialogRef.afterClosed().subscribe(result => {
          if(result)
            this.router.navigateByUrl('/restaurantList');
        })
      }
      else
        this.router.navigateByUrl('/' + this.restaurantId + '/Edit');
    }
    else //for restaurants
      this.router.navigate(['/restaurant/' + this.userData.restaurant_fid + '/settings']);
  }

  //Navigate to business hours page
  nextPage(){
    if(!this.hoursSaved){
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
    this.userData = decode(localStorage.getItem('token'));
  }

  onChanges(){
    console.log(this.businessHoursArray)
    var isEqual = this.functions.compareObjects(this.businessHoursArrayCached, this.businessHoursArray);
    if(isEqual)
      this.hoursSaved = true;
    else
      this.hoursSaved = false;
  }

}
