import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { AnalyticsUserLogService } from '../../services/analytics-user-log.service';
import { UserLog } from '../../models/userLog.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss']
})

export class UserLogComponent implements OnInit, AfterViewInit {

  displayedColumns = ['event', 'page', 'notes', 'createdAt'];
  dataSource:MatTableDataSource<UserLog> = new MatTableDataSource<UserLog>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userLogService: AnalyticsUserLogService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    //Subscribe to the route parameters and get DeviceId
    this.route.params.subscribe(params => {
      //send deviceId into the service
      this.userLogService.getUserLog(params['deviceId']).subscribe(
        userLogs => this.dataSource.data = userLogs
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
