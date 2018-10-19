import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FunctionsService } from '../_services/functions.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import * as decode from 'jwt-decode';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  email1: any;
  email2: any;
  email3: any;
  name: any;
  message: any;
  apiUrl = environment.apiURL;
  formOne = false;
  formTwo = false;
  formThree = false;
  screens = [
    'assets/images/screen1.png',
    'assets/images/screen2.png',
    'assets/images/screen3.png',
    'assets/images/screen4.png',
    'assets/images/screen5.png'
  ]

  constructor(
    public userService: UserService,
    private router: Router,
    private functions: FunctionsService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
  }

  logout(){
    this.userService.logout();
    this.functions.changeRestaurantName('');
    this.router.navigate(['/login']);
  }

  login(){
    this.router.navigate(['/login']);
  }

  navigateToApp(){
    var user = decode(localStorage.getItem('eatiblToken'));
    if (user.type == "Admin")
      this.router.navigate(['/restaurantList']);
    else if (user.type == "Restaurant"){
      var restaurantId = user.restaurant_fid;
      this.router.navigate(['/restaurant/' + restaurantId + '/bookings']);
    }
  }

  emailFormSubmit(type){
    var postObject: any;
    if(type == 'User')
      postObject = {
        email: this.email1,
        type: type
      }
    if(type == 'Restaurant')
      postObject = {
        email: this.email2,
        type: type
      }
    if(type == 'General')
      postObject = {
        name: this.name,
        email: this.email3,
        message: this.message,
        type: type
      }
    this.http.post(this.apiUrl + '/homepage/emailForm', postObject)
      .subscribe(
        res => {
          if(res)
            if(type == 'User')
              this.formOne = true;
            if(type == 'Restaurant')
              this.formTwo = true;
            if(type == 'General')
              this.formThree = true;
        });
  }

  //Reveal on scroll function
  revealOnScroll(){

  }

}
