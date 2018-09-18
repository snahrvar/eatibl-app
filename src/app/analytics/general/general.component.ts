import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionsService } from './../../_services/functions.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  constructor(
    public functions: FunctionsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigateTo(link){
    this.router.navigate([link])
  }

}
