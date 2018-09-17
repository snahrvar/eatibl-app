import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { AnalyticsUserService } from '../../services/analytics-user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {

  displayedColumns = ['deviceId', 'name', 'email', 'type', 'phone', 'createdAt'];
  dataSource:MatTableDataSource<User> = new MatTableDataSource<User>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: AnalyticsUserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => this.dataSource.data = users
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
