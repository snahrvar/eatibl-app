import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: 'restaurant-details.component.html',
  styleUrls: ['restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit {
  private sub: any;
  action: any;
  restaurantId: number;
  restaurant: Object = {
    contacts: [],
    dineIn: true,
    takeOut: false
  };
  contentLoaded = false; //Prevent content from loading until api calls are returned
  submitted = false; //Used to disable submit button once pressed
  apiUrl = environment.apiURL;

  constructor( private http: HttpClient, private route:ActivatedRoute, private router: Router ) {

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.action = params['action'];
      this.restaurantId = params['restaurantId'];
      //Only get restaurant information if we are editing an existing one
      if(this.action == 'Edit')
        this.http.get(this.apiUrl + '/restaurant/' + this.restaurantId)
          .subscribe(
            res => {
              this.restaurant = res;
              this.contentLoaded = true;
            },
            err => {
              console.log("Error occurred");
            }
          );
      else
        this.contentLoaded = true;
    });
  }

  addContact(){
    var contact = {
      name: '',
      position: '',
      email: '',
      phone: '',
      notes: ''
    };
    this.restaurant['contacts'].push(contact);
  }

  removeContact(index){
    this.restaurant['contacts'].splice(index, 1);
  }

  submitRestaurant(){
    this.submitted = true;
    this.http.post(this.apiUrl + '/restaurant/create', this.restaurant)
      .subscribe(
        res => { //Returns restaurant ID
          console.log(res);
          this.router.navigateByUrl('/' + res + '/hours');
        },
        err => {
          console.log(err);
        }
      );
  }

  ngOnInit() {
  }

}
