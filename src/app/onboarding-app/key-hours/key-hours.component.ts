import { Component, OnInit, AfterViewChecked, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
import { environment } from '../../../environments/environment';
import { FunctionsService } from '../../_services/functions.service';

@Component({
  selector: 'app-key-hours',
  templateUrl: 'key-hours.component.html',
  styleUrls: ['key-hours.component.scss']
})
export class KeyHoursComponent implements OnInit {
  private sub: any;
  restaurantId: any;
  buttonGroupElements: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  submitted = false; //Used to disable submit button once pressed

  discounts: any;
  dailyHours: any;
  totalHours = [];
  apiUrl = environment.apiURL;

  Math = Math; //Allow front end to use math.round or math.floor etc.

  displayArrows(event){
    if(event.target.classList.value.indexOf("activeDynamic") == -1){
      if(event.target.classList.value.indexOf("active") >= 0){
        this.renderer.removeClass(event.target.previousElementSibling,"displayed");
        this.renderer.removeClass(event.target.nextElementSibling,"displayed");
        this.renderer.removeClass(event.target,"active");
      }
      else{
        this.renderer.addClass(event.target.previousElementSibling,"displayed");
        this.renderer.addClass(event.target.nextElementSibling,"displayed");
        this.renderer.addClass(event.target,"active");
      }
    }
  }

  addPoint(event, type, index, hour){
    var existingIndex = this.dailyHours[index][type].indexOf(hour);

    if(existingIndex == -1) { //if peak hour not including in existing data, push it. Push it good.
      this.dailyHours[index][type].push(hour);
      //If user clicks on the fontawesome i element, add active to button not i
      if(event.target.localName == "i")
        this.renderer.addClass(event.target.parentElement, "active");
      else
        this.renderer.addClass(event.target, "active");
    }
    else { //if peak hour already in array, take it out
      this.dailyHours[index][type].splice(existingIndex, 1);
      this.renderer.removeClass(event.target, "active");
      //If user clicks on the fontawesome i element, add active to button not i
      if(event.target.localName == "i")
        this.renderer.removeClass(event.target.parentElement, "active");
      else
        this.renderer.removeClass(event.target, "active");
    }
  }

  constructor(private http: HttpClient, private renderer: Renderer2, private route:ActivatedRoute, private router: Router, private functions: FunctionsService  ) {

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
    this.http.get(this.apiUrl + '/hours/' + this.restaurantId)
      .subscribe(
        res => {
          this.dailyHours = res;
          for(var i=0; i < this.dailyHours.length; i++){
            //create an empty array where the size is determined by the total number of business hours for that day
            var hoursThisDay = new Array(Math.ceil(this.dailyHours[i].close) - Math.floor(this.dailyHours[i].open));
            this.totalHours.push(hoursThisDay);
          }
          console.log(this.dailyHours);
          this.contentLoaded = true;
        },
        err => {
          console.log("Error occurred");
        }
      );
    })
  }

  //Used to display the raw time data as a clocktime on the frontend
  formatTime(value){
    var hour = Math.floor(value);
    if(hour < 12)
      return hour + ' AM';
    else if(hour < 13 && hour >= 12)
      return hour + ' PM';
    else if(hour >= 13 && hour < 24){
      hour = hour - 12;
      return hour + ' PM';
    }
    else if(hour >= 24){
      hour = hour - 24;
      return hour + ' AM';
    }
  }

  submitKeyHours(){
    this.submitted = true;
    this.http.post(this.apiUrl + '/hours/' + this.restaurantId + '/update', this.dailyHours)
      .subscribe(
        res => {
          console.log(res);
          this.http.get(this.apiUrl + '/discount/' + this.restaurantId + '/week')
            .subscribe(
              res => {
                this.discounts = res;
                if(!this.discounts.length)
                  this.http.get(this.apiUrl + '/discount/' + this.restaurantId + '/generate')
                    .subscribe(
                      res => {
                        console.log(res);
                        this.router.navigateByUrl('/' + this.restaurantId + '/pricing/week');
                      },
                      err => {
                        console.log(err);
                      }
                    );
                else
                  this.router.navigateByUrl('/' + this.restaurantId + '/pricing/week');
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

    //set navigation url for weekly pricing page (so we can set link for back button)
    this.functions.setNavigation(this.restaurantId + '/keyHours');

  }

}
