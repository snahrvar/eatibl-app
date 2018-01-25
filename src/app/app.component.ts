import { Component,OnInit, OnChanges  } from '@angular/core';
import { SampleService } from './sample.service';
import { LoginService } from './_services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  importedData = [];

  constructor(private loginService: LoginService, private sampleService: SampleService, private router: Router){}

  ngOnInit(): void {
    this.importedData = this.sampleService.numbers;
    this.sampleService.sayHello();
    console.log(this.importedData);
    this.sampleService.addNumber(25);
    console.log(this.importedData);
  }

  logout(){
    if(localStorage.getItem('user')) {
      localStorage.removeItem('user'); //log out
      this.router.navigate(['/login']);
    }
  }
}
