import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as _ from 'underscore';
import { environment } from '../../environments/environment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurants: any;
  discounts: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.http.get(this.apiUrl + '/restaurant/all')
      .subscribe(
        res => {
          this.restaurants = res;
          console.log(this.restaurants);
          this.http.get(this.apiUrl + '/discount/all')
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

  deleteRestaurant(restaurantId){
    let dialogRef = this.dialog.open(RestaurantListDeleteDialog, {
      width: '250px'
    });
    // this.http.get(this.apiUrl + '/restaurant/' + restaurantId + '/disable',)
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => {
    //       console.log("Error occurred");
    //     }
    //   );
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

@Component({
  selector: 'restaurant-list-delete-dialog',
  templateUrl: 'restaurant-list-delete-dialog.html',
})
export class RestaurantListDeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<RestaurantListDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
