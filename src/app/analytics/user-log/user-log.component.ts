import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { AnalyticsUserLogService } from '../../services/analytics-user-log.service';
import { UserLog } from '../../models/userLog.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss']
})

export class UserLogComponent implements OnInit, AfterViewInit {

  displayedColumns = ['event', 'page', 'notes', 'createdAt'];
  dataSource:MatTableDataSource<UserLog> = new MatTableDataSource<UserLog>();
  apiUrl = environment.apiURL;
  details: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userLogService: AnalyticsUserLogService, private router: Router, private route: ActivatedRoute, private http:HttpClient) { }

  ngOnInit() {
    //Subscribe to the route parameters and get DeviceId
    this.route.params.subscribe(params => {
      //send deviceId into the service
      this.userLogService.getUserLog(params['deviceId']).subscribe(
        userLogs => this.dataSource.data = userLogs
      );

      //get user Details
      this.http.get(this.apiUrl + '/analytics/userLogs/'+params['deviceId']+'/details')
        .subscribe(
          res => {
            this.details = res;
            console.log(res);
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  FilterUser(value) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
