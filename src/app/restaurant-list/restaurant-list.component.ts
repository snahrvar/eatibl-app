import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurants: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:3000/restaurant/all')
      .subscribe(
        res => {
          this.restaurants = res;
          this.contentLoaded = true;
          console.log(this.restaurants);
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  ngOnInit() {
  }

}
