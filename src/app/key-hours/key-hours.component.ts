import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as _ from 'underscore';

@Component({
  selector: 'app-key-hours',
  templateUrl: './key-hours.component.html',
  styleUrls: ['key-hours.component.scss']
})
export class KeyHoursComponent implements OnInit {

  dailyHours: any;
  totalHours = [];

  displayArrows(event){
    console.log(event);
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
      this.renderer.addClass(event.target, "active");
    }
    else { //if peak hour already in array, take it out
      this.dailyHours[index][type].splice(existingIndex, 1);
      this.renderer.removeClass(event.target, "active");
    }

    console.log(this.dailyHours[index]);
  }

  constructor(private http: HttpClient, private renderer: Renderer2) {
    this.http.get('http://localhost:3000/hours')
      .subscribe(
        res => {
          this.dailyHours = res;
          for(var i=0; i < this.dailyHours.length; i++){
            //create an empty array where the size is determined by the total number of business hours for that day
            var hoursThisDay = new Array(this.dailyHours[i].close - this.dailyHours[i].open)
            this.totalHours.push(hoursThisDay);
          }
          console.log(this.dailyHours);
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  submitKeyHours(){
    this.http.post('http://localhost:3000/hours/update', this.dailyHours)
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

}
