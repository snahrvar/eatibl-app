import { Component,OnInit  } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['business-hours.component.scss']
})
export class BusinessHoursComponent implements OnInit {

  public businessHours: [number[]];

  constructor(private http: HttpClient){
    console.log("Hello");
    this.businessHours = [[9, 21],[11, 21],[11, 21],[11, 21],[11, 21],[11, 21],[11, 21]];
  }

  rangeConfig: any = {
    connect: true,
    range: {
      min: 0,
      max: 24
    },
    step: 0.5,
    tooltips: [true, true]
  }

  submitHours(){
    this.http.post('http://localhost:3000/hours/create', this.businessHours)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  ngOnInit() {
  }

}
