import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as _ from 'underscore';

@Injectable()
export class FunctionsService {

  link: any;

  //Set and get restaurant name for the header
  private restaurantNameSource = new BehaviorSubject<string>("");

  restaurantName = this.restaurantNameSource.asObservable();

  constructor(
    private route:ActivatedRoute,
    private router: Router
  ) {}

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

  //Sets or changes the restaurant name in local storage
  changeRestaurantName(name: string) {
    localStorage.setItem('restaurantName', name);
    this.restaurantNameSource.next(name);
  }

  //Gets the restaurant name from local storage to put into the header
  getRestaurantName() {
    var name = localStorage.getItem('restaurantName');
    if(name != null)
      this.restaurantNameSource.next(name);
  }

  //Returns true if both objects are completely identical
  compareObjects(object1, object2){
    return _.every(_.keys(object2), function(currentKey) {
      return _.has(object1, currentKey) &&
        _.isEqual(object1[currentKey], object2[currentKey]);
    });
  }

  //General navigation function
  navigateTo(link, optionalParams){
    let navigationExtras: NavigationExtras = {
      queryParams: optionalParams
    };
    if(!optionalParams)
      this.router.navigate([link]);
    else
      this.router.navigate([link], navigationExtras);
  }
}
