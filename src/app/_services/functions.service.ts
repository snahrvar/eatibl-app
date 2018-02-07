import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FunctionsService {

  link: any;

  //Set and get restaurant name for the header
  private restaurantNameSource = new BehaviorSubject<string>("");

  restaurantName = this.restaurantNameSource.asObservable();

  constructor() {}

  //Format a raw time to clocktime. Full is true if we want minutes
  formatTime(value, full){
    var clockTime;
    var hour = Math.floor(value);
    var minutes = full ? (value - hour) == 0.5 ? ':30' : ':00' : '';
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

  setNavigation(value){
    this.link = value;
  }

  changeRestaurantName(name: string) {
    localStorage.setItem('restaurantName', name);
    this.restaurantNameSource.next(name);
  }

  getRestaurantName() {
    var name = localStorage.getItem('restaurantName');
    if(name != null)
      this.restaurantNameSource.next(name);
  }
}
