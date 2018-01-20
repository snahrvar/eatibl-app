import { Component,OnInit  } from '@angular/core';
import { SampleService } from './sample.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  importedData = [];

  constructor(private sampleService: SampleService){  }

  ngOnInit(): void {
    this.importedData = this.sampleService.numbers;
    this.sampleService.sayHello();
    console.log(this.importedData);
    this.sampleService.addNumber(25);
    console.log(this.importedData);
  }

  title = 'app';
}
