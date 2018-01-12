import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as _ from 'underscore';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurants: any;
  discounts: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:3000/restaurant/all')
      .subscribe(
        res => {
          this.restaurants = res;
          console.log(this.restaurants);
          this.http.get('http://localhost:3000/discount/all')
            .subscribe(
              res => {
                this.discounts = res;
                this.checkDiscounts();
                // this.contentLoaded = true;
                console.log(this.restaurants);
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

  checkDiscounts(){
    for(var i = 0; i < this.restaurants.length; i++){
      var restaurant = this.restaurants[i];
      this.restaurants[i].discounts = _.some(this.discounts, function(discount){
        return discount['restaurant_fid'] == restaurant._id;
      })
    }
    this.contentLoaded = true;
  }

  ngOnInit() {
  }

}
