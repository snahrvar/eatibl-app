import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FunctionsService } from '../../_services/functions.service';

@Component({
  selector: 'app-restaurant-settings',
  templateUrl: './restaurant-settings.component.html',
  styleUrls: ['./restaurant-settings.component.scss']
})
export class RestaurantSettingsComponent implements OnInit {

  private sub: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  restaurantId: any;

  constructor(
    private route:ActivatedRoute,
    public functions: FunctionsService
  ) { }

  ngOnInit() {
    this.contentLoaded = true;

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
    });
  }

}
