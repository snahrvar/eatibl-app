import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { AnalyticsUserLogService } from '../../services/analytics-user-log.service';
import { UserLog } from '../../models/userLog.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-recent-log',
  templateUrl: './recent-log.component.html',
  styleUrls: ['./recent-log.component.scss']
})

export class RecentLogComponent implements OnInit, AfterViewInit {

  displayedColumns = ['event', 'deviceId','page', 'notes', 'createdAt'];
  dataSource:MatTableDataSource<UserLog> = new MatTableDataSource<UserLog>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userLogService: AnalyticsUserLogService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userLogService.getRecentLog().subscribe(
      recentLogs => this.dataSource.data = recentLogs
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
