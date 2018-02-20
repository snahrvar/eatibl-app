import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private sub: any;
  contentLoaded = false; //Prevent content from loading until api calls are returned
  apiUrl = environment.apiURL;
  newUser = {
    name: '',
    email: '',
    phone: '',
    password: '',
    type: 'Restaurant',
    restaurant_fid: ''
  };
  restaurant: any;


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.contentLoaded = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.newUser.restaurant_fid = params['restaurantId'];

      this.http.get(this.apiUrl + '/restaurant/' + params['restaurantId'])
        .subscribe(
          res => {
            this.restaurant = res;
            this.contentLoaded = true;
          },
          err => {
            console.log("Error occurred");
          }
        );
    });
  }

  submitRegister(){
    this.http.post(this.apiUrl + '/restaurant/register', this.newUser)
      .subscribe(
        res => { //Returns restaurant ID
          this.router.navigate(['/']);
        },
        err => {
          console.log(err);
        }
      );
  }

}
