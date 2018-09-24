import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-daily-data',
  templateUrl: './daily-data.component.html',
  styleUrls: ['./daily-data.component.scss']
})

export class DailyDataComponent implements OnInit, AfterViewInit {

  apiUrl = environment.apiURL;
  displayedColumns = ['date', 'devices', 'bookings', 'bookingAttempts', 'sessions', 'users'];
  dataSource:MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(private http:HttpClient) {}

  ngOnInit() {
    this.http.get(this.apiUrl + '/analytics/dailyData')
      .subscribe(
        res => {
          let resultArray:any = res;
          this.dataSource.data = resultArray;
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  ngAfterViewInit():void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  FilterUser(value) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
