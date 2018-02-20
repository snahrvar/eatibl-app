import { Component,OnInit, OnChanges  } from '@angular/core';
import { SampleService } from './sample.service';
import { UserService } from './_services/user.service';
import { FunctionsService } from './_services/functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  importedData = [];
  restaurantName:string;

  constructor(public userService: UserService, private sampleService: SampleService, private router: Router, private functions: FunctionsService){}

  ngOnInit(): void {
    this.importedData = this.sampleService.numbers;
    this.sampleService.sayHello();
    console.log(this.importedData);
    this.sampleService.addNumber(25);

    //Get restaurant name from local storage on load
    this.functions.getRestaurantName();

    //Subscribe to the restaurant name observable
    this.functions.restaurantName.subscribe(restaurantName => this.restaurantName = restaurantName);
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
