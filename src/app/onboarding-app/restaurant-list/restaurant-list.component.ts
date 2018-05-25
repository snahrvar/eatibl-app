import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as _ from 'underscore';
import { environment } from '../../../environments/environment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import { FunctionsService } from './../../_services/functions.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-restaurant-list',
  templateUrl: 'restaurant-list.component.html',
  styleUrls: ['restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurants: any;
  discounts: any;
  users: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  apiUrl = environment.apiURL;

  confirmDialogRef: MatDialogRef<DialogConfirmComponent>;

  constructor(private http: HttpClient, public dialog: MatDialog, public functions: FunctionsService, public router: Router) {
  }

  navigateTo(link, name){
    this.functions.changeRestaurantName(name);
    this.router.navigate([link])
  }

  deleteRestaurant(restaurant){
    console.log(restaurant);
    this.confirmDialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: "Delete Restaurant",
        message: "Would you like to delete " + restaurant.name + "?"
      }
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if(result)
        this.http.get(this.apiUrl + '/restaurant/' + restaurant._id + '/disable',)
        .subscribe(
          res => {
            this.removeRestaurant(restaurant._id);
            console.log(this.restaurants);
          },
          err => {
            console.log("Error occurred");
          }
        );
    })
  }

  removeRestaurant(restaurantId){
    var index = _.findIndex(this.restaurants, function(restaurant){
      return restaurant['_id'] == restaurantId
    });
    this.restaurants.splice(index, 1);
  }

  unsetRestaurantName(){
    this.functions.changeRestaurantName('');
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

  //Navigate to restaurant edit page
  editRestaurant(restaurantId){
      this.router.navigateByUrl('/' + restaurantId + '/action/Edit');
  }

  //Navigate to business hours page
  addRestaurant(){
    this.router.navigateByUrl('/restaurant/Add');
  }

  ngOnInit() : void {
    this.unsetRestaurantName();
    this.http.get(this.apiUrl + '/restaurant/all')
      .subscribe(
        res => {
          this.restaurants = res;
          this.http.get(this.apiUrl + '/restaurant/users')
            .subscribe(
              res => {
                this.users = res;
                this.http.get(this.apiUrl + '/discount/all')
                  .subscribe(
                    res => {
                      this.discounts = res;
                      this.checkDiscounts();
                      console.log(this.restaurants);
                    },
                    err => {
                      console.log(err);
                    }
                  );
              },
              err => {
                console.log(err);
              }
            );
        },
        err => {
          console.log(err);
        }
      );
  }
}
