import { Component,OnInit, OnChanges  } from '@angular/core';
import { SampleService } from './sample.service';
import { UserService } from './_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  importedData = [];

  constructor(public userService: UserService, private sampleService: SampleService, private router: Router){}

  ngOnInit(): void {
    this.importedData = this.sampleService.numbers;
    this.sampleService.sayHello();
    console.log(this.importedData);
    this.sampleService.addNumber(25);
    console.log(this.importedData);
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
