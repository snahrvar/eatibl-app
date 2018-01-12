import { Component, OnInit, AfterViewChecked, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-key-hours',
  templateUrl: './key-hours.component.html',
  styleUrls: ['key-hours.component.scss']
})
export class KeyHoursComponent implements OnInit {
  private sub: any;
  restaurantId: any;
  buttonGroupElements: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  submitted = false; //Used to disable submit button once pressed

  dailyHours: any;
  totalHours = [];

  displayArrows(event){
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
    console.log(this.dailyHours);
  }

  constructor(private http: HttpClient, private renderer: Renderer2, private route:ActivatedRoute, private router: Router  ) {

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
    this.http.get('http://localhost:3000/hours/' + this.restaurantId)
      .subscribe(
        res => {
          this.dailyHours = res;
          for(var i=0; i < this.dailyHours.length; i++){
            //create an empty array where the size is determined by the total number of business hours for that day
            var hoursThisDay = new Array(this.dailyHours[i].close - this.dailyHours[i].open)
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

  submitKeyHours(){
    console.log(this.dailyHours)
    this.submitted = true;
    this.http.post('http://localhost:3000/hours/' + this.restaurantId + '/update', this.dailyHours)
      .subscribe(
        res => {
          console.log(res);
          this.http.get('http://localhost:3000/discount/' + this.restaurantId + '/generate')
            .subscribe(
              res => {
                console.log(res);
                this.router.navigateByUrl('/' + this.restaurantId + '/discount/week');
              },
              err => {
                console.log(err);
              }
            );
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  ngOnInit() {
  }

  // ngAfterViewChecked(){
  //   this.buttonGroupElements = document.getElementsByClassName("button-row");
  //   if (this.buttonGroupElements.length)
  //     for (var i = 0; i < this.buttonGroupElements.length; i++){
  //       console.log(this.buttonGroupElements[i]);
  //     }
  // }

}
