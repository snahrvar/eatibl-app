import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { AnalyticsBookingService } from '../../services/analytics-booking.service';
import { Booking } from '../../models/booking.model';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, AfterViewInit {

  displayedColumns = ['user_fid','restaurant_fid', 'date', 'time', 'discount', 'people', 'name','email','disabled','redeemed','createdAt'];
  dataSource:MatTableDataSource<Booking> = new MatTableDataSource<Booking>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private bookingService: AnalyticsBookingService, private router: Router) { }

  ngOnInit() {
    this.bookingService.getBookings().subscribe(
      bookings => this.dataSource.data = bookings
    );
  }

  navigateToDevice(deviceId){
    this.router.navigate(['/analytics/users/' + deviceId ]);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  FilterUser(value) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
