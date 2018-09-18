import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { AnalyticsRestaurantService } from '../../services/analytics-restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'vicinity', 'bookings', 'bookingCount', 'customers', 'bookingAttempt', 'mapVisit', 'cardVisit', 'markerClick', 'created_at'];
  dataSource:MatTableDataSource<Restaurant> = new MatTableDataSource<Restaurant>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private restaurantService: AnalyticsRestaurantService, private router: Router) { }

  ngOnInit() {
    this.restaurantService.getRestaurants().subscribe(
      restaurants => this.dataSource.data = restaurants
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  FilterUser(value) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
