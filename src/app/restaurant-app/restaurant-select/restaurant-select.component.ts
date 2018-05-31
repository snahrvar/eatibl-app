import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-restaurant-select',
  templateUrl: './restaurant-select.component.html',
  styleUrls: ['./restaurant-select.component.scss']
})
export class RestaurantSelectComponent implements OnInit {

  contentLoaded = false;
  userData: any;

  restaurants = [
    {
      name: 'Restaurant 1',
      address: '768 Bean Avenue',
    },
    {
      name: 'Restaurant 2',
      address: '1354 Artichoke Boulevard',
    },
    {
      name: 'Restaurant 3',
      address: '64 Leek Street',
    }
  ]

  constructor(
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.userData = decode(localStorage.getItem('eatiblToken'));
    console.log(this.userData)
    this.contentLoaded = true;
  }

}
