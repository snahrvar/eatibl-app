import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as _ from 'underscore';

@Component({
  selector: 'app-funnel',
  templateUrl: './funnel.component.html',
  styleUrls: ['./funnel.component.scss']
})
export class FunnelComponent implements OnInit {

  constructor(private http: HttpClient) { }

  apiUrl = environment.apiURL;
  resultArray: any;
  chartLoading = true;
  barChartData:any = [{data: [100,0,0,0], label:'Series A'}, {data: [0,0,0,0], label: "Series B"}];

  //dataset #1 filter
  rangeDates1: Date[] = [new Date("July 26 2018"), new Date("Dec 31 2019")];
  testLow1: number = 0;
  testHigh1: number = 100;

  //dataset #2 filter
  rangeDates2: Date[] = [new Date("July 26 2018"), new Date("Dec 31 2019")];
  testLow2: number = 0;
  testHigh2: number = 100;

  ngOnInit() {
    //get the initial dataset
    this.gatherData(1);
  }

  //call API to gather
  gatherData(number){
    this.chartLoading = true;

    if(number == 1) //gather data for set #1
      var postObj = {testRange: [this.testLow1,this.testHigh1], dateRange: this.rangeDates1};
    else //gather data for set #2
      var postObj = {testRange: [this.testLow2,this.testHigh2], dateRange: this.rangeDates2};

    this.http.post(this.apiUrl + '/analytics/funnel', postObj)
      .subscribe(
        res => {
          this.resultArray = res;
          this.createChart(this.resultArray, number);
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  createChart(result, number){
    var currentData = JSON.parse(JSON.stringify(this.barChartData)); //cache currentData and separate from barCharData
    var newData = [result['App Start']/result['App Start']*100, result['Visit Restaurant']/result['App Start']*100,
                  result['Booking: Initiated']/result['App Start']*100, result['Create Booking: Success']/result['App Start']*100];

    if(number == 1)
      this.barChartData = [
          {data: newData, label: 'Sample Size: '+result['App Start']},
          currentData[1]
      ];

    if(number == 2){
      this.barChartData = [
        currentData[0],
        {data: newData, label: 'Sample Size: '+result['App Start']}
      ];
    }

    this.chartLoading = false;
  }

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['App Start', 'Visit Restaurant', 'Booking: Initiated', 'Create Booking: Success'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
}
