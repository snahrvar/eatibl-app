import { Component,OnInit, OnChanges  } from '@angular/core';
import { SampleService } from './sample.service';
import { UserService } from './_services/user.service';
import { FunctionsService } from './_services/functions.service';
import { Router } from '@angular/router';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  restaurantName:string;
  userData: any;

  constructor(public userService: UserService, private sampleService: SampleService, public router: Router, private functions: FunctionsService){}

  ngOnInit(): void {
    this.userData = decode(localStorage.getItem('eatiblToken'));
  }

  //Navigate to home page
  goHome(){
    if(localStorage.getItem('eatiblToken') != null){
      this.userData = decode(localStorage.getItem('eatiblToken'));
      if(this.userData.type == "Restaurant") { // for restaurants
        if (this.userData.restaurants.length > 1){
          this.router.navigate(['/restaurant/select']);
          this.functions.changeRestaurantName('');
        }
        if (this.userData.restaurants.length == 1)
          this.router.navigate(['/restaurant/' + this.userData.restaurants[0] + '/bookings']);
      }
      else if(this.userData.type == "Admin") // for admins
        this.router.navigate(['/restaurantList'])
    }
    else
      this.router.navigate(['/'])
  }

  navigateTo(link){
    this.functions.changeRestaurantName('');
    this.router.navigate([link])
  }

  logout(){
    this.userService.logout();
    this.functions.changeRestaurantName('');
    this.router.navigate(['/login']);
  }

  login(){
    this.router.navigate(['/login']);
  }

  //Fires when the router outlet content changes
  componentAdded(event){
    this.userData = decode(localStorage.getItem('eatiblToken'));

    //Subscribe to the restaurant name observable
    this.functions.restaurantName.subscribe(restaurantName => this.restaurantName = restaurantName);

    //Get restaurant name from local storage on load
    this.functions.getRestaurantName();
  }
}
