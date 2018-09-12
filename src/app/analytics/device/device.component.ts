import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { AnalyticsDeviceService } from '../../services/analytics-device.service';
import { Device } from '../../models/device.model';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit, AfterViewInit {

  displayedColumns = ['deviceId', 'platform', 'model', 'version', 'eatiblVersion', 'createdAt'];
  dataSource:MatTableDataSource<Device> = new MatTableDataSource<Device>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private deviceService: AnalyticsDeviceService, private router: Router) { }

  ngOnInit() {
    this.deviceService.getDevices().subscribe(
      devices => this.dataSource.data = devices
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
