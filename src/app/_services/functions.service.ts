import { Injectable } from '@angular/core';

@Injectable()
export class FunctionsService {

  link: any;

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
    console.log(value);
    this.link = value;
  }
  getNavigation(){
    console.log('get');
    return this.link;
  }
}
