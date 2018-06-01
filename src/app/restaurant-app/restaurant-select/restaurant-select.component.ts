import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FunctionsService } from './../../_services/functions.service';
import { environment } from '../../../environments/environment';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-restaurant-select',
  templateUrl: './restaurant-select.component.html',
  styleUrls: ['./restaurant-select.component.scss']
})
export class RestaurantSelectComponent implements OnInit {

  contentLoaded = false;
  userData: any;
  apiUrl = environment.apiURL;
  restaurants: any;

  constructor(
    public functions: FunctionsService,
    private http: HttpClient,
    private router: Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.userData = decode(localStorage.getItem('eatiblToken'));
    this.http.post(this.apiUrl + '/restaurant/multiple', this.userData.restaurants)
      .subscribe(
        res => {
          this.restaurants = res;
        },
        err => {
          console.log(err);
        }
      );
    this.contentLoaded = true;
  }

  navigateTo(link, name){
    this.functions.changeRestaurantName(name);
    this.router.navigate([link])
  }

}
