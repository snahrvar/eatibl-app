import { Component,OnInit  } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public businessHours: [number[]];
  public username:string;

  onChange(value:any){
    console.log(value);
  }

  constructor(private http: HttpClient){
    console.log("Hello");
    this.businessHours = [[9, 21],[11, 21],[11, 21],[11, 21],[11, 21],[11, 21],[11, 21]];
    this.username = "Enter a name";
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
    this.http.post('http://localhost:3000', this.businessHours)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occurred");
        }
      );
  }

  ngOnInit(): void {

    //sample get
    //this.http.get('http://localhost:3000')
    //  .subscribe(data => {
    //    //console.log(data[0]);
    //    this.results = data[0];
    //  }
    //);

    //sample post
    this.http.post('http://localhost:3000', {
        title: 'foo',
        body: 'bar',
        userId: 1
      })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

  title = 'app';
}
