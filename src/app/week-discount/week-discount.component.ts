import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-week-discount',
  templateUrl: './week-discount.component.html',
  styleUrls: ['./week-discount.component.scss']
})
export class WeekDiscountComponent implements OnInit {
  private sub: any;
  private router: any;
  restaurantId: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned

  discounts: any;
  businessHours: any;
  graph = [];
  discountArray = [];

  //To build the daily discount bars cards on front end
  buildDiscountArray(discounts, businessHours){

    //Loop through each day
    for (var i = 0; i < businessHours.length; i++){
      let day = {} as any;
      day.day = businessHours[i].day; //For card header

      //Build the y-axes values for the discount chart
      day.discountValue = new Array ((businessHours[i].close - businessHours[i].open) * 2); //Initialize array based on business hours
      day.discountValue.fill(0);

      for (var a = 0; a < discounts.length; a++){
        if(discounts[a].day == day.day){
          var index = (discounts[a].time - businessHours[i].open) * 2;
          day.discountValue[index] = discounts[a].discount;
        }
      }

      //Build the x-axes labels for the discount chart
      day.discountTime = [];

      for (var x = 0; x < day.discountValue.length; x++){
        day.discountTime.push(businessHours[i].open +(0.5 * x));
      }

      this.discountArray.push(day);
    }
    this.contentLoaded = true;
  }

  //Generate discount bar charts
  generateCharts(){
    for(var i = 0; i < this.discountArray.length; i++) {
      this.graph.push({
        'data': {
          labels: this.discountArray[i].discountTime,
          datasets: [
            {
              label: 'Discount',
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              data: this.discountArray[i].discountValue
            }
          ]
        },
        'options': {
          legend: {
            display: false
          },
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                stepSize: 10,
                max: 50,
                beginAtZero: true
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              }
            }]
          }
        }
      })
    }
  }

  constructor(private http: HttpClient, private route:ActivatedRoute) {
    //Initialize router
    this.router = Router;

    //Subscribe to the route parameters
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
      this.http.get('http://localhost:3000/discount/' + this.restaurantId + '/week')
        .subscribe(
          res => {
            this.discounts = res;
            console.log(this.discounts);
            this.http.get('http://localhost:3000/hours/' + this.restaurantId)
              .subscribe(
                res => {
                  this.businessHours = res;
                  console.log(this.businessHours);
                  this.buildDiscountArray(this.discounts, this.businessHours);
                  console.log(this.discountArray);
                  this.generateCharts();
                  console.log(this.graph)
                },
                err => {
                  console.log("Error occurred");
                }
              );
          },
          err => {
            console.log("Error occurred");
          }
        );
    })
  }

  ngOnInit() {
  }

}
