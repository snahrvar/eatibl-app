import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-day-discount',
  templateUrl: './day-discount.component.html',
  styleUrls: ['./day-discount.component.scss']
})
export class DayDiscountComponent implements OnInit, OnDestroy {

  day: any;
  discounts: any;
  hours: any;
  private sub: any;
  test = 10;

  //Configurations for all sliders
  rangeConfig: any = {
    connect: [true, false],
    range: {
      min: 0,
      max: 50
    },
    step: 10,
    tooltips: true,
    direction: 'rtl',
    orientation: 'vertical'
  }

  //To build the daily discount bars cards on front end
  buildDiscountArray(discounts, businessHours){

    //Loop through each day
    for (var i = 0; i < businessHours.length; i++){
      let day = {} as any;
      if(this.day == businessHours[i].day){
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
      }
    }
  }

  constructor( private http: HttpClient, private route:ActivatedRoute ) {
    this.sub = this.route.params.subscribe(params => {
      this.day = params['day'];
      this.http.get('http://localhost:3000/discount/' + this.day)
        .subscribe(
          res => {
            this.discounts = res;
            console.log(this.discounts);
            this.http.get('http://localhost:3000/hours')
              .subscribe(
                res => {
                  this.hours = res;
                  console.log(this.hours)
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
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
