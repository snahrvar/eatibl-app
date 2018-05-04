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

  constructor(public userService: UserService, private sampleService: SampleService, private router: Router, private functions: FunctionsService){}

  ngOnInit(): void {
    this.userData = decode(localStorage.getItem('token'));
  }

  //Navigate to home page
  goHome(){
    if(localStorage.getItem('token') != null){
      this.userData = decode(localStorage.getItem('token'));
      if(this.userData.type == "Restaurant") // for restaurants
        this.router.navigate(['/restaurant/' + this.userData.restaurant_fid + '/bookings']);
      else if(this.userData.type == "Admin") // for admins
        this.router.navigate(['/restaurantList'])
    }
    else
      this.router.navigate(['/'])
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
    this.userData = decode(localStorage.getItem('token'));

    //Subscribe to the restaurant name observable
    this.functions.restaurantName.subscribe(restaurantName => this.restaurantName = restaurantName);

    //Get restaurant name from local storage on load
    this.functions.getRestaurantName();
  }
}
