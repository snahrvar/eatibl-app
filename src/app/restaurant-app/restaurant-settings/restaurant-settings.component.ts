import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FunctionsService } from '../../_services/functions.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogTermsComponent } from '../../dialog-terms/dialog-terms.component';

@Component({
  selector: 'app-restaurant-settings',
  templateUrl: './restaurant-settings.component.html',
  styleUrls: ['./restaurant-settings.component.scss']
})
export class RestaurantSettingsComponent implements OnInit {

  private sub: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  restaurantId: any;
  restaurant = {} as any;
  termsDialogRef: MatDialogRef<DialogTermsComponent>;

  constructor(
    private route:ActivatedRoute,
    public functions: FunctionsService,
    public dialog: MatDialog
  ) { }

  //Open terms of agreement
  termsDialog(restaurant){
    //Opens restaurant agreement form
    this.termsDialogRef = this.dialog.open(DialogTermsComponent, {
      data: {
        restaurant: restaurant
      }
    });
  }

  ngOnInit() {
    this.contentLoaded = true;

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
    });

    //Used for restaurant dashboard access
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.restaurant.terms = params;
      });
  }

}
