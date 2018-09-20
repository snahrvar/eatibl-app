import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as _ from 'underscore';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  constructor(private http: HttpClient) { }
  apiUrl = environment.apiURL;
  lineChartData:Array<any>;
  resultArray: any;
  weekday: any;
  days = [
    {label: "Monday",value: "Monday"},
    {label: "Tuesday",value: "Tuesday"},
    {label: "Wednesday",value: "Wednesday"},
    {label: "Thursday",value: "Thursday"},
    {label: "Friday",value: "Friday"},
    {label: "Saturday",value: "Saturday"},
    {label: "Sunday",value: "Sunday"},
  ];

  ngOnInit() {
    this.http.get(this.apiUrl + '/analytics/activity')
      .subscribe(
        res => {
          this.resultArray = res;
          this.dailyResult('Monday'); //gather default data for Monday
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  dailyResult(day){
    //Create an array for each hour of the day (default value 0)
    var hourData = {
      "App Start": new Array(24).fill(0),
      "Booking: Initiated": new Array(24).fill(0),
      "Create Booking: Success": new Array(24).fill(0)
    }

    var dayData = _.filter(this.resultArray, function(dataPoint){
      return dataPoint['weekDay'] == day;
    });

    for(var i = 0; i < dayData.length; i++){
      hourData[dayData[i]['event']][Number(dayData[i]['hour'])]++;
    }

    // lineChart
    this.lineChartData = [
      {data: hourData['App Start'], label: 'App Start'},
      {data: hourData['Booking: Initiated'], label: 'Booking: Initiated'},
      {data: hourData['Create Booking: Success'], label: 'Create Booking: Success'}
    ];
  }

  public lineChartLabels:Array<any> = ['0', '1', '2', '3', '4', '5', '6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,77,77,0)',
      borderColor: 'rgba(77,77,77,1)',
      pointBackgroundColor: 'rgba(77,77,77,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,77,77,1)'
    },
    { // blue
      backgroundColor: 'rgba(86,214,73,0)',
      borderColor: 'rgba(86,214,73,1)',
      pointBackgroundColor: 'rgba(86,214,73,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(86,214,73,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

}
