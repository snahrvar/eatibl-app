import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FunctionsService } from '../_services/functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public userService: UserService, private router: Router, private functions: FunctionsService) { }

  ngOnInit() {
  }

  logout(){
    this.userService.logout();
    this.functions.changeRestaurantName('');
    this.router.navigate(['/login']);
  }

  login(){
    this.router.navigate(['/login']);
  }

}
