import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  results: any;
  constructor(private http: HttpClient){}

  ngOnInit(): void {
    //sample get
    this.http.get('http://localhost:3000')
      .subscribe(data => {
        //console.log(data[0]);
        this.results = data[0];
      }
    );

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
